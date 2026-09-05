// lib/groq.js - Complete file with fixed feedback

export async function generateQuestions(jobRole, experience, skills) {
  console.log('Generating questions for:', jobRole);
  
  const apiKey = process.env.GROQ_API_KEY;
  
  if (apiKey && apiKey !== 'your_groq_api_key_here' && apiKey.startsWith('gsk_')) {
    try {
      console.log('Using Groq API');
      const Groq = (await import('groq-sdk')).default;
      const groq = new Groq({ apiKey });
      
      const prompt = `Generate 5 interview questions for a ${jobRole} position with ${experience} years of experience.
      The candidate has skills in ${skills}. Generate a mix of technical, behavioral, and situational questions.
      Return ONLY a JSON array of strings. Example: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]`;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert interviewer. Return ONLY valid JSON array of strings.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.1-70b-versatile',
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = completion.choices[0]?.message?.content || '[]';
      console.log('Groq response:', content);
      
      try {
        const questions = JSON.parse(content);
        if (Array.isArray(questions) && questions.length > 0) {
          console.log('Generated questions from Groq');
          return questions;
        }
      } catch (e) {
        console.log('Failed to parse JSON:', e.message);
      }
    } catch (error) {
      console.log('Groq API error:', error.message);
    }
  } else {
    console.log('No valid Groq API key found, using fallback');
  }
  
  return getDynamicFallbackQuestions(jobRole, experience, skills);
}

export async function evaluateAnswer(question, answer, jobRole) {
  console.log('Evaluating answer for:', jobRole);
  console.log('Answer:', answer);
  
  const apiKey = process.env.GROQ_API_KEY;
  
  if (apiKey && apiKey !== 'your_groq_api_key_here' && apiKey.startsWith('gsk_')) {
    try {
      console.log('Using Groq API for feedback');
      const Groq = (await import('groq-sdk')).default;
      const groq = new Groq({ apiKey });
      
      const prompt = `Evaluate this interview answer for a ${jobRole} position:
      
      Question: ${question}
      Answer: ${answer}
      
      Provide feedback as JSON with these keys: score (1-10), strengths, weaknesses, suggestions, overallFeedback.
      Be specific and constructive. Return ONLY valid JSON.`;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert interviewer providing detailed, constructive feedback. Return ONLY valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.1-70b-versatile',
        temperature: 0.5,
        max_tokens: 1500,
      });

      const content = completion.choices[0]?.message?.content || '{}';
      console.log('Groq feedback response:', content);
      
      try {
        const feedback = JSON.parse(content);
        if (feedback && feedback.score) {
          console.log('Feedback from Groq');
          return feedback;
        }
      } catch (e) {
        console.log('Failed to parse feedback JSON:', e.message);
      }
    } catch (error) {
      console.log('Groq API error:', error.message);
    }
  } else {
    console.log('No valid Groq API key found, using intelligent fallback');
  }
  
  return generateIntelligentFeedback(question, answer, jobRole);
}

function generateIntelligentFeedback(question, answer, jobRole) {
  console.log('Generating intelligent feedback for:', question.substring(0, 50));
  
  const wordCount = answer.split(' ').length;
  const questionLower = question.toLowerCase();
  const answerLower = answer.toLowerCase();
  
  // Detect question topic
  const isReactQuestion = /react|component|hook|state|props|jsx|usestate|useeffect|context|redux/i.test(questionLower);
  const isStateQuestion = /state management|state|redux|context|store|dispatch|reducer|zustand|recoil/i.test(questionLower);
  const isRenderingQuestion = /rendering|ssr|csr|server side|client side|hydrat|next/i.test(questionLower);
  const isPerformanceQuestion = /performance|optimize|speed|load|cache|bundle|chunk|memo|lazy/i.test(questionLower);
  const isResponsiveQuestion = /responsive|mobile|flex|grid|media query|breakpoint|adaptive/i.test(questionLower);
  const isBackendQuestion = /api|server|database|node|express|mongodb|sql|authentication|authorization/i.test(questionLower);
  
  // Check answer content
  const hasExamples = /for example|specifically|like|such as|instance|project|built|created|developed|implemented|designed|worked on|used|utilized/i.test(answerLower);
  const hasTechnicalTerms = /react|vue|angular|node|express|mongodb|sql|api|rest|graphql|docker|aws|azure|redux|context|hooks|usestate|useeffect|nextjs|typescript|javascript|python|java|spring|django|flask|tailwind|bootstrap|css|html|git|github|jwt|oauth|websocket|microservice|kubernetes|ci\/cd|devops|agile|scrum|testing|jest|cypress|webpack|vite|rollup|npm|yarn|pnpm/i.test(answerLower);
  const hasStructure = /first|second|third|finally|however|moreover|additionally|in conclusion|to begin|next|then|after that|step|process|approach|methodology|framework|firstly|secondly|lastly|initially|subsequently|ultimately/i.test(answerLower);
  const hasQuantifiable = /\d+%|\d+ percent|improved|increased|reduced|faster|better|higher|lower|saved|saving|time|cost|efficiency|accuracy|handled|users|requests|performance|load time|response time/i.test(answerLower);
  
  // Question relevance
  const importantWords = questionLower.split(' ').filter(w => w.length > 4 && !['about', 'which', 'what', 'where', 'when', 'why', 'how', 'your', 'with', 'from', 'have', 'this', 'that', 'than', 'then', 'they', 'them', 'their', 'there', 'these', 'those'].includes(w));
  let relevantWords = 0;
  for (const word of importantWords) {
    if (answerLower.includes(word)) {
      relevantWords++;
    }
  }
  
  // Calculate score
  let score = 5;
  let strengths = [];
  let weaknesses = [];
  let suggestions = [];
  
  // 1. Length
  if (wordCount > 40) {
    score += 1.5;
    strengths.push("Comprehensive answer with good detail");
  } else if (wordCount > 25) {
    score += 1;
    strengths.push("Adequate length with reasonable detail");
  } else if (wordCount > 15) {
    // Neutral
  } else {
    weaknesses.push("Answer is too brief");
    suggestions.push("Expand your answer with more details and explanation");
  }
  
  // 2. Examples
  if (hasExamples) {
    score += 1.5;
    strengths.push("Used specific examples");
  } else {
    weaknesses.push("No specific examples provided");
    suggestions.push("Add a concrete example from your experience");
  }
  
  // 3. Technical terms
  if (hasTechnicalTerms) {
    score += 1.5;
    strengths.push("Good technical terminology");
  } else {
    weaknesses.push("Lacks technical terminology");
    suggestions.push("Use relevant technical terms for your role");
  }
  
  // 4. Structure
  if (hasStructure) {
    score += 0.5;
    strengths.push("Well-structured answer");
  } else {
    weaknesses.push("Could be better organized");
    suggestions.push("Structure: 1) Concept, 2) Example, 3) Result");
  }
  
  // 5. Quantifiable results
  if (hasQuantifiable) {
    score += 0.5;
    strengths.push("Mentioned measurable results");
  } else {
    weaknesses.push("No measurable results mentioned");
    suggestions.push("Add numbers: improved by X%, handled X users, reduced time by X%");
  }
  
  // 6. Relevance
  if (relevantWords > 2) {
    strengths.push("Directly addressed the question");
  } else if (relevantWords === 0) {
    weaknesses.push("Answer doesn't fully address the question");
    suggestions.push("Make sure your answer directly responds to: " + question);
  }
  
  // Topic-specific feedback
  let topicSpecificFeedback = '';
  if (isStateQuestion && !answerLower.includes('redux') && !answerLower.includes('context') && !answerLower.includes('zustand')) {
    weaknesses.push("Missing state management terms");
    suggestions.push("Mention specific state management tools: Redux, Context API, Zustand, Recoil");
  }
  if (isReactQuestion && !answerLower.includes('component') && !answerLower.includes('hook')) {
    weaknesses.push("Missing React-specific terms");
    suggestions.push("Mention React concepts: components, props, state, hooks");
  }
  if (isRenderingQuestion && !answerLower.includes('ssr') && !answerLower.includes('csr') && !answerLower.includes('server') && !answerLower.includes('client')) {
    weaknesses.push("Missing rendering terms");
    suggestions.push("Explain SSR vs CSR with specific examples");
  }
  if (isPerformanceQuestion && !answerLower.includes('lazy') && !answerLower.includes('cache') && !answerLower.includes('bundle') && !answerLower.includes('memo')) {
    weaknesses.push("Missing performance terms");
    suggestions.push("Mention specific optimization techniques: lazy loading, caching, code splitting, memoization");
  }
  if (isResponsiveQuestion && !answerLower.includes('media') && !answerLower.includes('flex') && !answerLower.includes('grid')) {
    weaknesses.push("Missing responsive design terms");
    suggestions.push("Mention specific techniques: media queries, Flexbox, Grid, mobile-first");
  }
  
  // Cap score
  score = Math.min(Math.round(score), 10);
  
  // Overall feedback
  let overallFeedback = '';
  if (score >= 9) {
    overallFeedback = 'Excellent answer! Comprehensive and well-structured.';
  } else if (score >= 7) {
    overallFeedback = 'Good answer! Add more examples and technical details to improve.';
  } else if (score >= 5) {
    overallFeedback = 'Decent answer. Expand with more detail and specific examples.';
  } else {
    overallFeedback = 'Needs improvement. Give more detailed answers with technical terms and examples.';
  }
  
  // Ensure we have strengths and weaknesses
  if (strengths.length === 0) {
    strengths = ["You attempted to answer the question"];
  }
  if (weaknesses.length === 0 && score < 8) {
    weaknesses = ["Could provide more detail and examples"];
  }
  if (suggestions.length === 0) {
    suggestions = ["Practice using the STAR method: Situation, Task, Action, Result"];
  }
  
  // Limit suggestions
  if (suggestions.length > 4) {
    suggestions = suggestions.slice(0, 4);
  }
  
  const result = {
    score: score,
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 3),
    suggestions: suggestions,
    overallFeedback: overallFeedback
  };
  
  console.log('Generated feedback score:', score);
  return result;
}

export async function generateFollowUpQuestion(previousQuestion, previousAnswer, jobRole) {
  const followUps = [
    "Can you elaborate more on that experience?",
    "What challenges did you face with that?",
    "How did you overcome those obstacles?",
    "What would you do differently next time?",
    "Can you give me a specific example?",
    "What did you learn from that experience?",
    "How did that impact the project outcome?",
    "What was your specific role in that?",
    "Could you explain the technical details behind that?",
    "What tools or technologies did you use?"
  ];
  
  return followUps[Math.floor(Math.random() * followUps.length)];
}

export async function generateOverallFeedback(responses, jobRole) {
  console.log('Generating overall feedback for:', jobRole);
  
  const apiKey = process.env.GROQ_API_KEY;
  
  if (apiKey && apiKey !== 'your_groq_api_key_here' && apiKey.startsWith('gsk_')) {
    try {
      console.log('Using Groq API for overall feedback');
      const Groq = (await import('groq-sdk')).default;
      const groq = new Groq({ apiKey });
      
      const responseText = responses.map((r, i) => 
        `Q${i+1}: ${r.question}\nA: ${r.answer}\nScore: ${r.feedback?.score || 'N/A'}`
      ).join('\n\n');
      
      const prompt = `Based on these interview responses for a ${jobRole} position:
      
      ${responseText}
      
      Provide overall feedback as JSON with these keys:
      - averageScore (number, 1-10)
      - strengths (array of strings)
      - weaknesses (array of strings)
      - suggestions (array of strings)
      - overallSummary (string)
      
      Return ONLY valid JSON.`;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert interviewer providing comprehensive interview feedback. Return ONLY valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.1-70b-versatile',
        temperature: 0.5,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content || '{}';
      console.log('Groq overall feedback response:', content);
      
      try {
        const feedback = JSON.parse(content);
        if (feedback && feedback.averageScore) {
          console.log('Overall feedback from Groq');
          return feedback;
        }
      } catch (e) {
        console.log('Failed to parse overall feedback JSON:', e.message);
      }
    } catch (error) {
      console.log('Groq API error:', error.message);
    }
  }
  
  console.log('Using fallback overall feedback');
  
  const scores = responses.map(r => r.feedback?.score || 0);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  const allStrengths = responses.map(r => r.feedback?.strengths).filter(Boolean).flat();
  const allWeaknesses = responses.map(r => r.feedback?.weaknesses).filter(Boolean).flat();
  const allSuggestions = responses.map(r => r.feedback?.suggestions).filter(Boolean).flat();
  
  const uniqueStrengths = [...new Set(allStrengths)];
  const uniqueWeaknesses = [...new Set(allWeaknesses)];
  const uniqueSuggestions = [...new Set(allSuggestions)];
  
  let summary = '';
  if (avgScore >= 8.5) {
    summary = 'Excellent performance! You demonstrated strong interview skills, clear communication, and technical depth. Keep up the great work!';
  } else if (avgScore >= 7) {
    summary = 'Good performance with solid answers. Focus on providing more specific examples and technical details to reach the next level.';
  } else if (avgScore >= 5.5) {
    summary = 'Fair performance with room for improvement. Work on structuring your answers better and including more concrete examples.';
  } else {
    summary = 'Needs improvement. Practice more, focus on understanding core concepts, and learn to structure your answers effectively.';
  }
  
  if (jobRole.toLowerCase().includes('ml') || jobRole.toLowerCase().includes('ai')) {
    summary += ' For ML/AI roles, emphasize practical project experience, model evaluation metrics, and your understanding of the ML lifecycle.';
  } else if (jobRole.toLowerCase().includes('frontend')) {
    summary += ' For frontend roles, highlight your experience with modern frameworks, performance optimization, and responsive design.';
  } else if (jobRole.toLowerCase().includes('backend')) {
    summary += ' For backend roles, focus on API design, database optimization, and scalability considerations.';
  } else if (jobRole.toLowerCase().includes('full stack')) {
    summary += ' For full-stack roles, demonstrate your ability to work across the entire stack and integrate frontend and backend seamlessly.';
  }
  
  return {
    averageScore: Math.round(avgScore * 10) / 10,
    strengths: uniqueStrengths.length > 0 ? uniqueStrengths.slice(0, 5) : ["You completed the interview and attempted all questions"],
    weaknesses: uniqueWeaknesses.length > 0 ? uniqueWeaknesses.slice(0, 5) : ["Could provide more specific details and examples"],
    suggestions: uniqueSuggestions.length > 0 ? uniqueSuggestions.slice(0, 5) : ["Practice structuring answers using STAR method"],
    overallSummary: summary
  };
}

function getDynamicFallbackQuestions(jobRole, experience, skills) {
  const role = jobRole ? jobRole.toLowerCase() : 'developer';
  const skillsList = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : (skills || []);
  const primarySkill = skillsList.length > 0 ? skillsList[0] : 'programming';
  
  const questionTemplates = {
    'frontend': [
      'What is your experience with ' + primarySkill + ' in frontend development?',
      'How do you handle state management in large applications?',
      'Explain the difference between client-side and server-side rendering.',
      'How do you optimize web performance?',
      'What is your approach to responsive design?'
    ],
    'backend': [
      'How do you design scalable APIs?',
      'Explain your experience with database optimization.',
      'What is your approach to authentication and authorization?',
      'How do you handle error handling and logging?',
      'Explain your experience with ' + primarySkill + ' in backend development.'
    ],
    'full stack': [
      'How do you structure a full-stack application?',
      'Explain your approach to API design and database modeling.',
      'How do you handle state management across frontend and backend?',
      'What is your experience with deployment and DevOps?',
      'How do you ensure security in full-stack applications?'
    ],
    'data': [
      'Explain your experience with data analysis and visualization.',
      'How do you handle large datasets?',
      'What is your approach to data cleaning and preprocessing?',
      'Explain your experience with machine learning models.',
      'How do you communicate complex data findings to non-technical stakeholders?'
    ],
    'devops': [
      'Explain your experience with CI/CD pipelines.',
      'How do you handle infrastructure as code?',
      'What is your approach to monitoring and alerting?',
      'How do you ensure system reliability and uptime?',
      'Explain your experience with containerization and orchestration.'
    ],
    'product': [
      'How do you prioritize features for development?',
      'Explain your experience with product roadmaps.',
      'How do you gather and analyze user feedback?',
      'What is your approach to stakeholder communication?',
      'How do you measure product success?'
    ],
    'design': [
      'Explain your design process from research to delivery.',
      'How do you incorporate user feedback into designs?',
      'What is your experience with design systems?',
      'How do you balance creativity with usability?',
      'Explain your approach to prototyping and testing.'
    ],
    'ai': [
      'How have you applied AI/ML in your projects using ' + primarySkill + '?',
      'Explain your experience with model deployment and scaling.',
      'How do you handle data preprocessing for machine learning?',
      'What metrics do you use to evaluate model performance?',
      'How do you stay updated with the latest AI/ML advancements?'
    ],
    'mobile': [
      'Explain your experience with cross-platform development.',
      'How do you handle offline storage in mobile apps?',
      'What is your approach to mobile performance optimization?',
      'How do you handle push notifications and background tasks?',
      'Explain your experience with app store deployment.'
    ]
  };

  let questions = null;
  for (const [key, value] of Object.entries(questionTemplates)) {
    if (role.includes(key)) {
      questions = [...value];
      break;
    }
  }

  if (!questions) {
    questions = [
      'Tell me about your experience with ' + primarySkill + '.',
      'Describe a challenging project you worked on recently.',
      'How do you stay updated with the latest technologies?',
      'What is your approach to problem-solving and debugging?',
      'Where do you see yourself in 5 years?'
    ];
  }

  const expLevel = parseInt(experience) || 0;
  if (expLevel >= 5) {
    questions = questions.map(q => q + ' (based on your senior-level experience)');
  } else if (expLevel >= 2) {
    questions = questions.map(q => q + ' (considering your mid-level experience)');
  } else {
    questions = questions.map(q => q + ' (as a junior/entry-level candidate)');
  }

  return questions;
}