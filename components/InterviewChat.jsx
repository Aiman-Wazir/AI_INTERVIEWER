'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, CheckCircle2, Mic, StopCircle } from 'lucide-react';

export default function InterviewChat({ interviewId, jobRole, onComplete }) {
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (interviewId) {
      loadInterview();
    }
  }, [interviewId]);

  const loadInterview = async () => {
    try {
      const response = await fetch(`/api/interview?action=get-status&interviewId=${interviewId}`);
      const data = await response.json();
      
      if (data.questions && data.responses) {
        const chatMessages = [];
        const responses = data.responses || [];
        
        if (data.questions.length > 0) {
          chatMessages.push({
            type: 'bot',
            content: data.questions[0],
            timestamp: new Date().toISOString()
          });
          setCurrentQuestion(data.questions[0]);
        }
        
        responses.forEach((response, index) => {
          chatMessages.push({
            type: 'user',
            content: response.answer,
            timestamp: response.timestamp
          });
          
          if (response.feedback) {
            chatMessages.push({
              type: 'feedback',
              content: response.feedback,
              timestamp: response.timestamp
            });
          }
          
          const nextQuestionIndex = index + 1;
          if (nextQuestionIndex < data.questions.length) {
            chatMessages.push({
              type: 'bot',
              content: data.questions[nextQuestionIndex],
              timestamp: new Date().toISOString()
            });
            setCurrentQuestion(data.questions[nextQuestionIndex]);
          }
        });
        
        setMessages(chatMessages);
        setProgress((responses.length / data.questions.length) * 100);
        
        if (responses.length >= data.questions.length) {
          setIsComplete(true);
        }
      }
    } catch (error) {
      console.error('Error loading interview:', error);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = {
      type: 'user',
      content: answer,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentAnswer = answer;
    setAnswer('');

    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit-answer',
          interviewId,
          question: currentQuestion,
          answer: currentAnswer,
          jobRole
        })
      });

      const data = await response.json();
      
      if (data.feedback) {
        const feedbackMessage = {
          type: 'feedback',
          content: data.feedback,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, feedbackMessage]);
      }

      setProgress(data.progress || 0);

      if (data.isComplete) {
        setIsComplete(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else if (data.nextQuestion) {
        setCurrentQuestion(data.nextQuestion);
        const nextQuestionMessage = {
          type: 'bot',
          content: data.nextQuestion,
          timestamp: new Date().toISOString()
        };
        setTimeout(() => {
          setMessages(prev => [...prev, nextQuestionMessage]);
        }, 1000);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message) => {
    switch (message.type) {
      case 'bot':
        return (
          <div className="flex items-start space-x-3 mb-4">
            <div className="avatar-ai flex-shrink-0">
              AI
            </div>
            <div className="chat-bubble-ai">
              <p className="text-slate-700 leading-relaxed">{message.content}</p>
              <span className="text-xs text-slate-400 mt-2 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        );

      case 'user':
        return (
          <div className="flex items-start space-x-3 mb-4 justify-end">
            <div className="chat-bubble-user">
              <p className="text-white leading-relaxed">{message.content}</p>
              <span className="text-xs text-blue-200 mt-2 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="avatar-user flex-shrink-0">
              You
            </div>
          </div>
        );

      case 'feedback':
        const feedback = message.content;
        return (
          <div className="flex justify-center mb-4">
            <div className="chat-bubble-feedback max-w-[90%] w-full">
              <div className="flex items-center space-x-2 mb-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  feedback.score >= 8 ? 'bg-emerald-100 text-emerald-700' :
                  feedback.score >= 6 ? 'bg-blue-100 text-blue-700' :
                  feedback.score >= 4 ? 'bg-amber-100 text-amber-700' :
                  'bg-rose-100 text-rose-700'
                }`}>
                  Score: {feedback.score}/10
                </div>
                {feedback.score >= 8 && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              </div>
              
              {feedback.strengths && feedback.strengths.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-emerald-600">✓ Strengths</p>
                  <ul className="text-sm text-slate-600 list-disc list-inside">
                    {feedback.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {feedback.weaknesses && feedback.weaknesses.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-rose-600">✗ Areas for Improvement</p>
                  <ul className="text-sm text-slate-600 list-disc list-inside">
                    {feedback.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {feedback.suggestions && feedback.suggestions.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-blue-600">💡 Suggestions</p>
                  <ul className="text-sm text-slate-600 list-disc list-inside">
                    {feedback.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {feedback.overallFeedback && (
                <p className="text-sm text-slate-700 mt-2 pt-2 border-t border-amber-200/50">
                  {feedback.overallFeedback}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isComplete) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Interview Complete! 🎉</h2>
        <p className="text-slate-500">Your feedback is being prepared...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] glass rounded-3xl border border-white/20 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200/50 bg-white/30 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-slate-700">Interview Session</h3>
            <p className="text-sm text-slate-500">Answer each question thoughtfully</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-slate-600">
              {Math.round(progress)}%
            </span>
            <div className="progress-bar w-24">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading interview questions...</span>
              </div>
            ) : (
              <span>Ready to start your interview?</span>
            )}
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx}>{renderMessage(msg)}</div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200/50 bg-white/30 backdrop-blur-sm">
        <div className="flex space-x-3">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="flex-1 input-modern resize-none min-h-[56px] max-h-[120px]"
            rows="2"
            disabled={isLoading || isComplete}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitAnswer();
              }
            }}
          />
          <div className="flex flex-col space-y-2">
            <button
              onClick={submitAnswer}
              disabled={!answer.trim() || isLoading || isComplete}
              className="btn-primary px-6 h-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`px-4 h-10 rounded-xl flex items-center justify-center transition-all ${
                isRecording 
                  ? 'bg-rose-500 text-white animate-pulse' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isRecording ? <StopCircle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}