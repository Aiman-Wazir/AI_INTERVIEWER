// lib/groq.js - Complete file without emojis

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
        model: 'llama3-70b-8192',
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
        model: 'llama3-70b-8192',
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
  console.log('Generating intelligent feedback');
  
  const wordCount = answer.split(' ').length;
  const hasExamples = /for example|specifically|like|such as|instance|e\.g\.|e.g|i\.e\.|i.e|for instance|in particular|namely|including|especially|project|built|created|developed|implemented|designed|worked on|contributed|led|managed|delivered|launched|deployed/i.test(answer);
  const hasTechnicalTerms = /python|pytorch|tensorflow|ml|ai|model|training|data|algorithm|machine learning|deep learning|neural|dataset|accuracy|loss|validation|test|train|supervised|unsupervised|reinforcement|cnn|rnn|lstm|transformer|bert|gpt|llm|api|database|server|client|frontend|backend|cloud|docker|aws|azure|react|node|javascript|typescript|sql|nosql|mongodb|postgres|redis|graphql|rest|microservice|container|kubernetes|ci\/cd|devops|agile|scrum|nlp|computer vision|llm|fine-tuning|embedding|tokenization|backpropagation|gradient|optimizer/i.test(answer);
  const hasStructure = /first|second|third|finally|however|moreover|additionally|in conclusion|to begin|next|then|after that|step|process|approach|methodology|framework|firstly|secondly|lastly/i.test(answer);
  const hasQuantifiableResults = /\d+%|\d+ percent|improved|increased|reduced|faster|better|higher|lower|saved|saving|time|cost|efficiency|accuracy|precision|recall|f1|score|metric|reduced|by|over|about/i.test(answer);
  
  let score = 5;
  let strengths = [];
  let weaknesses = [];
  let suggestions = [];
  
  // 1. Check length
  if (wordCount > 40) {
    score += 1.5;
    strengths.push("Good length - you provided enough detail");
  } else if (wordCount > 20) {
    score += 0.5;
    strengths.push("Adequate length - consider adding more detail");
  } else if (wordCount > 10) {
    weaknesses.push("Your answer is brief. Try to expand with more details.");
    suggestions.push("Instead of just saying 'I use MongoDB', say: 'I used MongoDB with Mongoose ODM for schema modeling. In my last project, we stored user profiles and order data, handling 50k+ documents.'");
  } else {
    weaknesses.push("Your answer is very short. This doesn't demonstrate your knowledge.");
    suggestions.push("A good answer should be 2-3 sentences. Try: 'I use MongoDB with Mongoose for schema validation. In my e-commerce project, I designed user and product schemas with proper indexing for fast queries.'");
  }
  
  // 2. Check for examples
  if (hasExamples) {
    score += 1.5;
    strengths.push("Good use of examples");
  } else {
    weaknesses.push("No specific examples provided");
    suggestions.push("Add a concrete example: 'For example, in my last project at [company], I built...' or 'I used this when I created a [type] application that...'");
  }
  
  // 3. Check for technical terms
  if (hasTechnicalTerms) {
    score += 1.5;
    strengths.push("Good use of technical terminology");
  } else {
    const roleLower = jobRole.toLowerCase();
    let techSuggestions = [];
    
    if (roleLower.includes('full stack') || roleLower.includes('fullstack')) {
      techSuggestions = [
        "Full stack roles use terms like: React, Node.js, Express, MongoDB, REST APIs, state management, Redux, Context API, authentication, JWT",
        "Example: 'I build full stack apps with React frontend, Node.js backend, and MongoDB database.'"
      ];
    } else if (roleLower.includes('frontend') || roleLower.includes('front-end')) {
      techSuggestions = [
        "Frontend roles use terms like: React, Vue, Angular, state management, Redux, Context API, hooks, useEffect, useState",
        "Example: 'I use React with Redux for state management and Tailwind for styling.'"
      ];
    } else if (roleLower.includes('backend') || roleLower.includes('back-end')) {
      techSuggestions = [
        "Backend roles use terms like: REST API, GraphQL, database, caching, authentication, JWT, OAuth, microservices",
        "Example: 'I build REST APIs with Node.js/Express, use MongoDB for data storage, and implement JWT authentication.'"
      ];
    } else if (roleLower.includes('ml') || roleLower.includes('ai') || roleLower.includes('machine learning')) {
      techSuggestions = [
        "ML/AI roles use terms like: model training, neural networks, supervised/unsupervised learning, CNN, RNN, transformers, BERT, GPT",
        "Example: 'I trained a CNN model using PyTorch on a dataset of 10k images, achieving 92% accuracy.'"
      ];
    } else {
      techSuggestions = [
        "Use terms specific to your field. For a ${jobRole} role, mention relevant technologies and concepts.",
        "Example: 'I use [technology] for [purpose] in my projects.'"
      ];
    }
    
    weaknesses.push("No technical terms used");
    techSuggestions.forEach(s => suggestions.push(s));
  }
  
  // 4. Check for structure
  if (hasStructure) {
    score += 1;
    strengths.push("Well-structured answer");
  } else {
    weaknesses.push("Lacks structure");
    suggestions.push("Structure your answer: First, explain the concept. Then, give an example. Finally, mention the result or impact.");
  }
  
  // 5. Check for quantifiable results
  if (hasQuantifiableResults) {
    score += 1;
    strengths.push("Mentioned measurable results");
  } else {
    weaknesses.push("No measurable results mentioned");
    suggestions.push("Add numbers to your answer: 'Improved performance by 40%', 'Reduced load time from 3s to 1s', 'Handled 10k+ users', 'Achieved 95% accuracy'");
  }
  
  // 6. Check if answer addresses the question
  const questionWords = question.toLowerCase().split(' ');
  const answerLower = answer.toLowerCase();
  let relevantWords = 0;
  const importantWords = questionWords.filter(w => w.length > 4 && !['about', 'which', 'what', 'where', 'when', 'why', 'how', 'your', 'with', 'from', 'have', 'this', 'that', 'than', 'then', 'they', 'them', 'their', 'there', 'these', 'those'].includes(w));
  
  for (const word of importantWords) {
    if (answerLower.includes(word)) {
      relevantWords++;
    }
  }
  
  if (relevantWords > 2) {
    strengths.push("Directly addressed the question");
  } else if (relevantWords === 0) {
    weaknesses.push("Your answer doesn't seem to address the question");
    suggestions.push("The question asks: '" + question + "'. Make sure your answer directly responds to this.");
  }
  
  // Cap score at 10
  score = Math.min(Math.round(score), 10);
  
  // Generate overall feedback
  let overallFeedback = '';
  if (score >= 9) {
    overallFeedback = 'Excellent! Your answer is comprehensive, well-structured, and demonstrates deep knowledge. Keep this quality!';
  } else if (score >= 7) {
    overallFeedback = 'Good answer! To improve, add more specific examples and measurable results.';
  } else if (score >= 5) {
    overallFeedback = 'Decent start. Focus on expanding your answer with examples and technical details.';
  } else {
    overallFeedback = 'Let\'s work on this. Try to give more detailed answers with examples and technical terms.';
  }
  
  if (strengths.length === 0) {
    strengths = ["You attempted to answer the question - that's a good start!"];
  }
  if (weaknesses.length === 0 && score < 8) {
    weaknesses = ["Could provide more detail and specific examples"];
  }
  if (suggestions.length === 0) {
    suggestions = ["Practice using the STAR method: Situation, Task, Action, Result"];
  }
  
  const result = {
    score: score,
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 3),
    suggestions: suggestions.slice(0, 4),
    overallFeedback: overallFeedback
  };
  
  console.log('Generated feedback:', result);
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
        model: 'llama3-70b-8192',
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
  
  console.log('Using fallback overall feedback with intelligent analysis');
  
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