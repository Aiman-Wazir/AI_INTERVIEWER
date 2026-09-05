import { 
  generateQuestions, 
  evaluateAnswer, 
  generateFollowUpQuestion, 
  generateOverallFeedback 
} from '@/lib/groq';
import storage from '@/lib/storage';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const interviewId = searchParams.get('interviewId');

    console.log('GET Request - Action:', action);
    console.log('GET Request - Interview ID:', interviewId);

    // Get single interview status
    if (action === 'get-status') {
      if (!interviewId) {
        return Response.json({ 
          success: false,
          error: 'Interview ID required' 
        }, { status: 400 });
      }

      const interview = storage.get(interviewId);
      if (!interview) {
        console.log('Interview not found:', interviewId);
        return Response.json({ 
          success: false,
          error: 'Interview not found. Please start a new interview.'
        }, { status: 404 });
      }

      console.log('Interview found:', interview.id);
      console.log('Questions:', interview.questions?.length || 0);
      console.log('Responses:', interview.responses?.length || 0);

      return Response.json({
        success: true,
        ...interview
      });
    }

    // List all interviews
    if (action === 'list') {
      const interviews = storage.getAll();
      console.log('Listing interviews:', interviews.length);
      return Response.json({
        success: true,
        count: interviews.length,
        interviews: interviews
      });
    }

    // Delete an interview
    if (action === 'delete') {
      if (!interviewId) {
        return Response.json({ 
          success: false,
          error: 'Interview ID required' 
        }, { status: 400 });
      }

      const deleted = storage.delete(interviewId);
      if (!deleted) {
        console.log('Interview not found for deletion:', interviewId);
        return Response.json({ 
          success: false,
          error: 'Interview not found' 
        }, { status: 404 });
      }

      console.log('Interview deleted:', interviewId);
      return Response.json({
        success: true,
        message: 'Interview deleted successfully'
      });
    }

    // Clear all interviews (for testing)
    if (action === 'clear') {
      storage.clear();
      return Response.json({
        success: true,
        message: 'All interviews cleared'
      });
    }

    return Response.json({ 
      success: false,
      error: 'Invalid action' 
    }, { status: 400 });

  } catch (error) {
    console.error('GET Error:', error);
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { action, interviewId, jobRole, experience, skills, question, answer } = await request.json();

    console.log('POST - Action:', action);
    console.log('POST - Job Role:', jobRole);

    switch (action) {
      case 'start': {
        console.log('Starting interview for:', jobRole);
        
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
          console.log('Using fallback questions');
        }

        const newInterviewId = `interview_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        
        const interviewData = {
          id: newInterviewId,
          jobRole,
          experience: parseInt(experience) || 0,
          skills: typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills || [],
          questions: questions,
          currentQuestion: 0,
          responses: [],
          startTime: new Date().toISOString(),
          status: 'in-progress',
          overallFeedback: null
        };
        
        storage.set(newInterviewId, interviewData);
        console.log('Interview created with ID:', newInterviewId);

        return Response.json({
          success: true,
          interviewId: newInterviewId,
          questions: questions,
          currentQuestion: 0,
          totalQuestions: questions.length
        });
      }

      case 'submit-answer': {
        console.log('Submitting answer for interview:', interviewId);
        
        if (!interviewId || !question || !answer) {
          return Response.json({ 
            success: false,
            error: 'Missing required fields' 
          }, { status: 400 });
        }

        // Force reload from file to get latest data
        storage.loadFromFile();
        
        const interview = storage.get(interviewId);
        if (!interview) {
          console.log('Interview not found:', interviewId);
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
          console.log('Feedback generation failed:', error.message);
          feedback = { 
            score: 7, 
            strengths: "Good effort on this answer.", 
            weaknesses: "Could provide more specific examples.",
            suggestions: "Practice using the STAR method.",
            overallFeedback: "Keep practicing!"
          };
        }
        
        interview.responses.push({
          question,
          answer,
          feedback: feedback,
          timestamp: new Date().toISOString()
        });

        const currentQuestionIndex = interview.currentQuestion + 1;
        const isComplete = currentQuestionIndex >= interview.questions.length;

        let nextQuestion = null;
        let overallFeedback = null;

        if (isComplete) {
          interview.status = 'completed';
          interview.endTime = new Date().toISOString();
          
          try {
            console.log('Generating overall feedback for:', interview.jobRole);
            overallFeedback = await generateOverallFeedback(interview.responses, interview.jobRole);
            interview.overallFeedback = overallFeedback;
            console.log('Overall feedback generated successfully');
          } catch (error) {
            console.log('Overall feedback generation failed:', error.message);
            const scores = interview.responses.map(r => r.feedback?.score || 0);
            const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
            
            overallFeedback = {
              averageScore: Math.round(avgScore * 10) / 10,
              strengths: ["You completed the interview"],
              weaknesses: ["Could provide more specific examples"],
              suggestions: ["Practice using the STAR method"],
              overallSummary: avgScore >= 7 ? "Good job" : "Keep practicing"
            };
            interview.overallFeedback = overallFeedback;
          }
        } else {
          nextQuestion = interview.questions[currentQuestionIndex];
        }

        interview.currentQuestion = currentQuestionIndex;
        
        // Save the interview
        storage.set(interviewId, interview);
        
        // Verify save
        const verifyInterview = storage.get(interviewId);
        console.log('Interview saved and verified:', !!verifyInterview);
        console.log('Status:', verifyInterview?.status);
        console.log('Has overall feedback:', !!verifyInterview?.overallFeedback);

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
    console.error('POST Error:', error);
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}