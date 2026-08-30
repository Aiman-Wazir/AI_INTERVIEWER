// This will work even without a Groq API key

export async function generateQuestions(jobRole, experience, skills) {
  console.log('🎯 Generating questions for:', jobRole);
  
  // Try to use Groq if API key exists
  const apiKey = process.env.GROQ_API_KEY;
  
  if (apiKey && apiKey !== 'your_groq_api_key_here' && apiKey.startsWith('gsk_')) {
    try {
      console.log('🔑 Using Groq API');
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
      console.log('📝 Groq response:', content);
      
      try {
        const questions = JSON.parse(content);
        if (Array.isArray(questions) && questions.length > 0) {
          console.log('✅ Generated questions from Groq');
          return questions;
        }
      } catch (e) {
        console.log('⚠️ Failed to parse JSON:', e.message);
      }
    } catch (error) {
      console.log('⚠️ Groq API error:', error.message);
    }
  } else {
    console.log('⚠️ No valid Groq API key found, using fallback');
  }
  
  return getDynamicFallbackQuestions(jobRole, experience, skills);
}

export async function evaluateAnswer(question, answer, jobRole) {
  console.log('📊 Evaluating answer for:', jobRole);
  console.log('📝 Answer:', answer);
  
  // Try to use Groq if API key exists
  const apiKey = process.env.GROQ_API_KEY;
  
  if (apiKey && apiKey !== 'your_groq_api_key_here' && apiKey.startsWith('gsk_')) {
    try {
      console.log('🔑 Using Groq API for feedback');
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
      console.log('📝 Groq feedback response:', content);
      
      try {
        const feedback = JSON.parse(content);
        if (feedback && feedback.score) {
          console.log('✅ Feedback from Groq');
          return feedback;
        }
      } catch (e) {
        console.log('⚠️ Failed to parse feedback JSON:', e.message);
      }
    } catch (error) {
      console.log('⚠️ Groq API error:', error.message);
    }
  } else {
    console.log('⚠️ No valid Groq API key found, using intelligent fallback');
  }
  
  // ✅ Intelligent fallback that actually analyzes the answer
  return generateIntelligentFeedback(question, answer, jobRole);
}

function generateIntelligentFeedback(question, answer, jobRole) {
  console.log('🧠 Generating intelligent feedback');
  
  // Basic analysis
  const wordCount = answer.split(' ').length;
  const hasExamples = /for example|specifically|like|such as|instance|e\.g\.|e.g|i\.e\.|i.e|for instance|in particular|namely|including|especially/i.test(answer);
  const hasTechnicalTerms = /python|pytorch|tensorflow|ml|ai|model|training|data|algorithm|machine learning|deep learning|neural|dataset|accuracy|loss|validation|test|train|supervised|unsupervised|reinforcement|cnn|rnn|lstm|transformer|bert|gpt|llm|api|database|server|client|frontend|backend|cloud|docker|aws|azure|react|node|javascript|typescript|sql|nosql|mongodb|postgres|redis|graphql|rest|microservice|container|kubernetes|ci\/cd|devops|agile|scrum|nlp|computer vision|llm|fine-tuning|embedding|tokenization|backpropagation|gradient|optimizer/i.test(answer);
  const hasStructure = /first|second|third|finally|however|moreover|additionally|in conclusion|to begin|next|then|after that|step|process|approach|methodology|framework/i.test(answer);
  const hasQuantifiableResults = /\d+%|\d+ percent|improved|increased|reduced|faster|better|higher|lower|saved|saving|time|cost|efficiency|accuracy|precision|recall|f1|score|metric/i.test(answer);
  
  // Score calculation
  let score = 5;
  let strengths = [];
  let weaknesses = [];
  let suggestions = [];
  
  // 1. Check length
  if (wordCount > 40) {
    score += 1.5;
    strengths.push("✅ Provided a detailed and comprehensive answer");
  } else if (wordCount > 25) {
    score += 1;
    strengths.push("✅ Good answer length with adequate detail");
  } else if (wordCount > 15) {
    strengths.push("✅ Adequate answer length");
  } else {
    weaknesses.push("❌ Answer is too brief (less than 15 words)");
    suggestions.push("💡 Elaborate more on your experience and provide specific details");
  }
  
  // 2. Check for examples
  if (hasExamples) {
    score += 1.5;
    strengths.push("✅ Used specific examples to support your answer");
  } else {
    weaknesses.push("❌ No specific examples provided");
    suggestions.push("💡 Include concrete examples from your projects or experience");
  }
  
  // 3. Check for technical terms
  if (hasTechnicalTerms) {
    score += 1.5;
    strengths.push("✅ Demonstrated strong technical knowledge with relevant terminology");
  } else if (hasTechnicalTerms === false && (jobRole.toLowerCase().includes('ml') || jobRole.toLowerCase().includes('ai') || jobRole.toLowerCase().includes('data') || jobRole.toLowerCase().includes('machine learning'))) {
    weaknesses.push("❌ Lacks technical terminology specific to ML/AI role");
    suggestions.push("💡 Use ML/AI specific terms like: model training, data preprocessing, hyperparameter tuning, neural networks, etc.");
  } else {
    weaknesses.push("❌ Lacks technical terminology");
    suggestions.push("💡 Use more technical terms relevant to the role");
  }
  
  // 4. Check for structure
  if (hasStructure) {
    score += 1;
    strengths.push("✅ Well-structured and organized answer");
  } else {
    weaknesses.push("❌ Could be better organized");
    suggestions.push("💡 Structure your answer using: 1) Context, 2) Action, 3) Result");
  }
  
  // 5. Check for quantifiable results
  if (hasQuantifiableResults) {
    score += 1;
    strengths.push("✅ Mentioned measurable results or outcomes");
  } else {
    weaknesses.push("❌ No measurable results mentioned");
    suggestions.push("💡 Include quantifiable results like accuracy improvements, time saved, or performance gains");
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
    strengths.push("✅ Directly addressed the question asked");
  } else if (relevantWords > 0) {
    strengths.push("✅ Partially addressed the question");
  } else {
    weaknesses.push("❌ Answer could be more focused on the specific question");
    suggestions.push("💡 Make sure your answer directly addresses what was asked");
  }
  
  // 7. Role-specific analysis
  const roleLower = jobRole.toLowerCase();
  if (roleLower.includes('machine learning') || roleLower.includes('ai') || roleLower.includes('data scientist')) {
    if (!hasTechnicalTerms) {
      suggestions.push("💡 For ML/AI roles, mention specific techniques like: supervised learning, neural networks, CNNs, RNNs, transformers, etc.");
    }
    if (!hasExamples) {
      suggestions.push("💡 Share specific ML projects: what model you used, dataset size, accuracy achieved");
    }
    if (!hasQuantifiableResults) {
      suggestions.push("💡 Include metrics like: model accuracy, precision, recall, F1 score, training time, etc.");
    }
  }
  
  if (roleLower.includes('frontend') || roleLower.includes('ui') || roleLower.includes('ux')) {
    if (!hasTechnicalTerms && !answerLower.includes('react') && !answerLower.includes('vue') && !answerLower.includes('angular')) {
      suggestions.push("💡 Mention specific frontend frameworks like React, Vue, or Angular");
    }
  }
  
  if (roleLower.includes('backend') || roleLower.includes('api')) {
    if (!hasTechnicalTerms && !answerLower.includes('api') && !answerLower.includes('database')) {
      suggestions.push("💡 Discuss API design, database modeling, and server-side architecture");
    }
  }
  
  // Cap score at 10
  score = Math.min(Math.round(score), 10);
  
  // Generate overall feedback based on score
  let overallFeedback = '';
  if (score >= 9) {
    overallFeedback = '🌟 Excellent answer! You demonstrated strong knowledge and communication skills. Keep up this quality!';
  } else if (score >= 7) {
    overallFeedback = '👏 Good answer! You\'re on the right track. Focus on adding more details and specific examples.';
  } else if (score >= 5) {
    overallFeedback = '📝 Decent answer but needs improvement. Focus on providing more detail, examples, and technical depth.';
  } else {
    overallFeedback = '📚 Needs significant improvement. Practice structuring your answers with specific examples and technical details.';
  }
  
  // Ensure we have at least one strength and weakness
  if (strengths.length === 0) {
    strengths = ["✅ You attempted to answer the question"];
  }
  if (weaknesses.length === 0 && score < 8) {
    weaknesses = ["📝 Could provide more detail and examples"];
  }
  if (suggestions.length === 0) {
    suggestions = ["💡 Practice using the STAR method: Situation, Task, Action, Result"];
  }
  
  // Limit to top 3 of each
  const result = {
    score: score,
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 3),
    suggestions: suggestions.slice(0, 3),
    overallFeedback: overallFeedback
  };
  
  console.log('📊 Generated feedback:', result);
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
  console.log('📊 Generating overall feedback for:', jobRole);
  
  // Try to use Groq if API key exists
  const apiKey = process.env.GROQ_API_KEY;
  
  if (apiKey && apiKey !== 'your_groq_api_key_here' && apiKey.startsWith('gsk_')) {
    try {
      console.log('🔑 Using Groq API for overall feedback');
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
      console.log('📝 Groq overall feedback response:', content);
      
      try {
        const feedback = JSON.parse(content);
        if (feedback && feedback.averageScore) {
          console.log('✅ Overall feedback from Groq');
          return feedback;
        }
      } catch (e) {
        console.log('⚠️ Failed to parse overall feedback JSON:', e.message);
      }
    } catch (error) {
      console.log('⚠️ Groq API error:', error.message);
    }
  }
  
  // Fallback overall feedback with intelligent analysis
  console.log('📋 Using fallback overall feedback with intelligent analysis');
  
  const scores = responses.map(r => r.feedback?.score || 0);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  // Collect all strengths, weaknesses, suggestions from individual feedback
  const allStrengths = responses.map(r => r.feedback?.strengths).filter(Boolean).flat();
  const allWeaknesses = responses.map(r => r.feedback?.weaknesses).filter(Boolean).flat();
  const allSuggestions = responses.map(r => r.feedback?.suggestions).filter(Boolean).flat();
  
  // Remove duplicates
  const uniqueStrengths = [...new Set(allStrengths)];
  const uniqueWeaknesses = [...new Set(allWeaknesses)];
  const uniqueSuggestions = [...new Set(allSuggestions)];
  
  // Generate summary based on average score
  let summary = '';
  if (avgScore >= 8.5) {
    summary = '🌟 Excellent performance! You demonstrated strong interview skills, clear communication, and technical depth. Keep up the great work!';
  } else if (avgScore >= 7) {
    summary = '👏 Good performance with solid answers. Focus on providing more specific examples and technical details to reach the next level.';
  } else if (avgScore >= 5.5) {
    summary = '📝 Fair performance with room for improvement. Work on structuring your answers better and including more concrete examples.';
  } else {
    summary = '📚 Needs improvement. Practice more, focus on understanding core concepts, and learn to structure your answers effectively.';
  }
  
  // Add role-specific advice
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
    strengths: uniqueStrengths.length > 0 ? uniqueStrengths.slice(0, 5) : ["✅ You completed the interview and attempted all questions"],
    weaknesses: uniqueWeaknesses.length > 0 ? uniqueWeaknesses.slice(0, 5) : ["📝 Could provide more specific details and examples"],
    suggestions: uniqueSuggestions.length > 0 ? uniqueSuggestions.slice(0, 5) : ["💡 Practice structuring answers using STAR method"],
    overallSummary: summary
  };
}

// ✅ DYNAMIC FALLBACK QUESTIONS - Based on job role
function getDynamicFallbackQuestions(jobRole, experience, skills) {
  const role = jobRole ? jobRole.toLowerCase() : 'developer';
  const skillsList = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : (skills || []);
  const primarySkill = skillsList.length > 0 ? skillsList[0] : 'programming';
  
  // Role-based question templates
  const questionTemplates = {
    'frontend': [
      `What is your experience with ${primarySkill} in frontend development?`,
      'How do you handle state management in large applications?',
      'Explain the difference between client-side and server-side rendering.',
      'How do you optimize web performance?',
      `What's your approach to responsive design?`
    ],
    'backend': [
      'How do you design scalable APIs?',
      'Explain your experience with database optimization.',
      `What's your approach to authentication and authorization?`,
      'How do you handle error handling and logging?',
      `Explain your experience with ${primarySkill} in backend development.`
    ],
    'full stack': [
      'How do you structure a full-stack application?',
      'Explain your approach to API design and database modeling.',
      'How do you handle state management across frontend and backend?',
      `What's your experience with deployment and DevOps?`,
      'How do you ensure security in full-stack applications?'
    ],
    'data': [
      'Explain your experience with data analysis and visualization.',
      'How do you handle large datasets?',
      `What's your approach to data cleaning and preprocessing?`,
      'Explain your experience with machine learning models.',
      'How do you communicate complex data findings to non-technical stakeholders?'
    ],
    'devops': [
      'Explain your experience with CI/CD pipelines.',
      'How do you handle infrastructure as code?',
      `What's your approach to monitoring and alerting?`,
      'How do you ensure system reliability and uptime?',
      'Explain your experience with containerization and orchestration.'
    ],
    'product': [
      'How do you prioritize features for development?',
      'Explain your experience with product roadmaps.',
      'How do you gather and analyze user feedback?',
      `What's your approach to stakeholder communication?`,
      'How do you measure product success?'
    ],
    'design': [
      'Explain your design process from research to delivery.',
      'How do you incorporate user feedback into designs?',
      `What's your experience with design systems?`,
      'How do you balance creativity with usability?',
      'Explain your approach to prototyping and testing.'
    ],
    'ai': [
      `How have you applied AI/ML in your projects using ${primarySkill}?`,
      'Explain your experience with model deployment and scaling.',
      'How do you handle data preprocessing for machine learning?',
      'What metrics do you use to evaluate model performance?',
      'How do you stay updated with the latest AI/ML advancements?'
    ],
    'mobile': [
      'Explain your experience with cross-platform development.',
      'How do you handle offline storage in mobile apps?',
      `What's your approach to mobile performance optimization?`,
      'How do you handle push notifications and background tasks?',
      'Explain your experience with app store deployment.'
    ]
  };

  // Find matching role
  let questions = null;
  for (const [key, value] of Object.entries(questionTemplates)) {
    if (role.includes(key)) {
      questions = [...value];
      break;
    }
  }

  // Default questions if no role matches
  if (!questions) {
    questions = [
      `Tell me about your experience with ${primarySkill}.`,
      'Describe a challenging project you worked on recently.',
      'How do you stay updated with the latest technologies?',
      `What's your approach to problem-solving and debugging?`,
      'Where do you see yourself in 5 years?'
    ];
  }

  // Add experience level context
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