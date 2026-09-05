import { generateOverallFeedback } from '@/lib/groq';
import storage from '@/lib/storage';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const interviewId = searchParams.get('interviewId');

    console.log('Fetching feedback for interview:', interviewId);

    if (!interviewId) {
      return Response.json({ 
        success: false,
        error: 'Interview ID required' 
      }, { status: 400 });
    }

    // Force reload from file to get latest data
    storage.loadFromFile();
    
    const interview = storage.get(interviewId);
    
    console.log('Interview found:', !!interview);
    console.log('Interview status:', interview?.status);
    console.log('Has overall feedback:', !!interview?.overallFeedback);
    console.log('Responses count:', interview?.responses?.length || 0);

    if (!interview) {
      console.log('Interview not found:', interviewId);
      return Response.json({ 
        success: false,
        error: 'Interview not found' 
      }, { status: 404 });
    }

    // If interview has overall feedback, return it
    if (interview.overallFeedback) {
      console.log('Returning existing overall feedback');
      return Response.json({
        success: true,
        interview: interview,
        overallFeedback: interview.overallFeedback
      });
    }

    // If no overall feedback yet, generate it
    if (interview.responses && interview.responses.length > 0) {
      try {
        console.log('Generating overall feedback...');
        const overallFeedback = await generateOverallFeedback(interview.responses, interview.jobRole);
        interview.overallFeedback = overallFeedback;
        storage.set(interviewId, interview);
        
        console.log('Overall feedback generated and saved');
        return Response.json({
          success: true,
          interview: interview,
          overallFeedback: overallFeedback
        });
      } catch (error) {
        console.error('Error generating feedback:', error);
        // Return basic feedback
        const scores = interview.responses.map(r => r.feedback?.score || 0);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        
        const basicFeedback = {
          averageScore: Math.round(avgScore * 10) / 10,
          strengths: ["You completed the interview"],
          weaknesses: ["Could improve specific answers"],
          suggestions: ["Practice more", "Review technical concepts"],
          overallSummary: avgScore >= 7 ? "Good job" : "Keep practicing"
        };
        
        interview.overallFeedback = basicFeedback;
        storage.set(interviewId, interview);
        
        return Response.json({
          success: true,
          interview: interview,
          overallFeedback: basicFeedback
        });
      }
    }

    return Response.json({ 
      success: false,
      error: 'No responses to generate feedback' 
    }, { status: 400 });

  } catch (error) {
    console.error('Feedback Error:', error);
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}