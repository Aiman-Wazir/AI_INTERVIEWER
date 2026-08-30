import { 
  generateQuestions, 
  evaluateAnswer, 
  generateFollowUpQuestion, 
  generateOverallFeedback 
} from '@/lib/groq';
import { firebaseDB } from '@/lib/firebase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const interviewId = searchParams.get('interviewId');

    console.log(' GET Request - Action:', action);
    console.log(' GET Request - Interview ID:', interviewId);

    if (action === 'get-status') {
      if (!interviewId) {
        return Response.json({ 
          success: false,
          error: 'Interview ID required' 
        }, { status: 400 });
      }

      const interview = await firebaseDB.get('interviews', interviewId);
      if (!interview) {
        console.log(' Interview not found in Firebase:', interviewId);
        return Response.json({ 
          success: false,
          error: 'Interview not found. Please start a new interview.'
        }, { status: 404 });
      }

      console.log('Interview found:', interview.id);
      console.log(' Questions:', interview.questions?.length || 0);
      console.log(' Responses:', interview.responses?.length || 0);

      return Response.json({
        success: true,
        ...interview
      });
    }

    if (action === 'list') {
      const interviews = await firebaseDB.query('interviews');
      return Response.json({
        success: true,
        count: interviews.length,
        interviews: interviews
      });
    }

    return Response.json({ 
      success: false,
      error: 'Invalid action' 
    }, { status: 400 });

  } catch (error) {
    console.error(' GET Error:', error);
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { action, interviewId, jobRole, experience, skills, question, answer } = await request.json();

    console.log(' POST - Action:', action);
    console.log(' POST - Job Role:', jobRole);

    switch (action) {
      case 'start': {
        console.log(' Starting interview for:', jobRole);
        
        // Generate questions
        let questions = [];
        try {
          questions = await generateQuestions(jobRole, experience, skills);
        } catch (error) {
          console.log('Groq generation failed:', error.message);
        }
        
        // If no questions, use fallback
        if (!questions || questions.length === 0) {
          questions = [
            `Tell me about yourself and your experience with ${jobRole}.`,
            `What interests you about the ${jobRole} position?`,
            `Describe a challenging project you worked on recently.`,
            `How do you handle tight deadlines and pressure?`,
            `Where do you see yourself in 5 years?`
          ];
          console.log(' Using fallback questions');
        }

        const interviewData = {
          jobRole,
          experience: parseInt(experience) || 0,
          skills: typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills || [],
          questions: questions,
          currentQuestion: 0,
          responses: [],
          startTime: new Date().toISOString(),
          status: 'in-progress',
          overallFeedback: null,
          createdAt: new Date().toISOString()
        };
        
        // Save to Firebase
        const newInterviewId = await firebaseDB.create('interviews', interviewData);
        console.log(' Interview created with ID:', newInterviewId);

        return Response.json({
          success: true,
          interviewId: newInterviewId,
          questions: questions,
          currentQuestion: 0,
          totalQuestions: questions.length
        });
      }

      case 'submit-answer': {
        console.log(' Submitting answer for interview:', interviewId);
        
        if (!interviewId || !question || !answer) {
          return Response.json({ 
            success: false,
            error: 'Missing required fields' 
          }, { status: 400 });
        }

        // Get interview from Firebase
        const interview = await firebaseDB.get('interviews', interviewId);
        if (!interview) {
          console.log(' Interview not found in Firebase:', interviewId);
          return Response.json({ 
            success: false,
            error: 'Interview not found. Please start a new interview.' 
          }, { status: 404 });
        }

        // Evaluate answer
        let feedback = null;
        try {
          feedback = await evaluateAnswer(question, answer, jobRole || interview.jobRole);
        } catch (error) {
          console.log(' Feedback generation failed:', error.message);
          feedback = { 
            score: 7, 
            strengths: "Good effort on this answer.", 
            weaknesses: "Could provide more specific examples.",
            suggestions: "Practice using the STAR method.",
            overallFeedback: "Keep practicing!"
          };
        }
        
        // Add response to interview
        const updatedResponses = [...(interview.responses || []), {
          question,
          answer,
          feedback: feedback,
          timestamp: new Date().toISOString()
        }];

        const currentQuestionIndex = (interview.currentQuestion || 0) + 1;
        const isComplete = currentQuestionIndex >= (interview.questions || []).length;

        let nextQuestion = null;
        let overallFeedback = null;

        if (isComplete) {
          // Generate overall feedback when interview is complete
          interview.status = 'completed';
          interview.endTime = new Date().toISOString();
          
          try {
            console.log(' Generating overall feedback for:', interview.jobRole);
            overallFeedback = await generateOverallFeedback(updatedResponses, interview.jobRole);
            console.log('Overall feedback generated successfully');
          } catch (error) {
            console.log(' Overall feedback generation failed:', error.message);
            // Calculate simple overall feedback
            const scores = updatedResponses.map(r => r.feedback?.score || 0);
            const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
            const allStrengths = updatedResponses.map(r => r.feedback?.strengths).filter(Boolean);
            const allWeaknesses = updatedResponses.map(r => r.feedback?.weaknesses).filter(Boolean);
            const allSuggestions = updatedResponses.map(r => r.feedback?.suggestions).filter(Boolean);
            
            let summary = '';
            if (avgScore >= 8) {
              summary = 'Excellent performance! You demonstrated strong interview skills. Keep up the great work!';
            } else if (avgScore >= 6) {
              summary = 'Good performance with room for improvement. Focus on providing more specific examples.';
            } else if (avgScore >= 4) {
              summary = 'Fair performance. Work on improving your answers with more details.';
            } else {
              summary = 'Needs improvement. Practice more and focus on fundamentals.';
            }
            
            overallFeedback = {
              averageScore: Math.round(avgScore * 10) / 10,
              strengths: allStrengths.length > 0 ? allStrengths.slice(0, 5) : ["You attempted all questions"],
              weaknesses: allWeaknesses.length > 0 ? allWeaknesses.slice(0, 5) : ["Could provide more specific examples"],
              suggestions: allSuggestions.length > 0 ? allSuggestions.slice(0, 5) : ["Practice using the STAR method"],
              overallSummary: summary
            };
          }
        } else {
          nextQuestion = interview.questions[currentQuestionIndex];
        }

        // Prepare update data
        const updateData = {
          responses: updatedResponses,
          currentQuestion: currentQuestionIndex,
          status: isComplete ? 'completed' : 'in-progress'
        };

        if (isComplete && overallFeedback) {
          updateData.overallFeedback = overallFeedback;
          updateData.endTime = new Date().toISOString();
        }

        // Update in Firebase
        await firebaseDB.update('interviews', interviewId, updateData);

        const progress = (currentQuestionIndex / interview.questions.length) * 100;

        return Response.json({
          success: true,
          feedback: feedback,
          nextQuestion: nextQuestion,
          isComplete: isComplete,
          progress: progress,
          currentQuestion: currentQuestionIndex,
          totalQuestions: interview.questions.length,
          overallFeedback: isComplete ? overallFeedback : null
        });
      }

      default:
        return Response.json({ 
          success: false,
          error: 'Invalid action' 
        }, { status: 400 });
    }
  } catch (error) {
    console.error(' POST Error:', error);
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}