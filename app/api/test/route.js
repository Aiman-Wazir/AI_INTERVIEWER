export async function GET() {
  try {
    // Test data
    const testData = {
      message: "✅ API is working!",
      timestamp: new Date().toISOString(),
      interview: {
        id: "test123",
        jobRole: "Frontend Developer",
        questions: [
          "Tell me about yourself.",
          "What are your strengths?",
          "Why do you want to work here?"
        ],
        responses: []
      }
    };
    
    return Response.json({ 
      success: true, 
      data: testData,
      environment: {
        node: process.version,
        next: process.env.NEXT_PUBLIC_VERCEL ? 'Vercel' : 'Local'
      }
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}