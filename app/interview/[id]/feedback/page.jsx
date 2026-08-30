'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function FeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const interviewId = params.id;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (session && interviewId) {
      fetchFeedback();
    }
  }, [session, status, interviewId, router]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔍 Fetching feedback for interview:', interviewId);
      
      const response = await fetch(`/api/interview/feedback?interviewId=${interviewId}`);
      const data = await response.json();
      
      console.log('📦 Feedback data:', data);
      
      if (!data.success) {
        setError(data.error || 'Failed to load feedback');
        return;
      }
      
      setFeedback(data);
    } catch (error) {
      console.error('❌ Error fetching feedback:', error);
      setError('Failed to load feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchFeedback();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading feedback...</p>
        </div>
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-700 mb-2">⚠️ Error</h2>
          <p className="text-red-600">{error || 'No feedback available'}</p>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
            <Link
              href="/dashboard"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const overallFeedback = feedback.overallFeedback || feedback;
  const interviewData = feedback.interview || feedback;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">📊 Interview Feedback</h1>

      {/* Overall Score */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Overall Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {overallFeedback.averageScore || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {interviewData.responses?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Questions Answered</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {interviewData.questions?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
        </div>

        {/* Overall Summary */}
        {overallFeedback.overallSummary && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">📌 Summary</h4>
            <p className="text-gray-600">{overallFeedback.overallSummary}</p>
          </div>
        )}
      </div>

      {/* Strengths */}
      {overallFeedback.strengths && overallFeedback.strengths.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h3 className="text-lg font-semibold text-green-600 mb-3">✅ Strengths</h3>
          <ul className="list-disc list-inside space-y-1">
            {overallFeedback.strengths.map((strength, index) => (
              <li key={index} className="text-gray-700">{strength}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {overallFeedback.weaknesses && overallFeedback.weaknesses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h3 className="text-lg font-semibold text-red-600 mb-3">📝 Areas for Improvement</h3>
          <ul className="list-disc list-inside space-y-1">
            {overallFeedback.weaknesses.map((weakness, index) => (
              <li key={index} className="text-gray-700">{weakness}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {overallFeedback.suggestions && overallFeedback.suggestions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-600 mb-3">💡 Suggestions for Improvement</h3>
          <ul className="list-disc list-inside space-y-1">
            {overallFeedback.suggestions.map((suggestion, index) => (
              <li key={index} className="text-gray-700">{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Individual Question Feedback */}
      {interviewData.responses && interviewData.responses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">📋 Question-by-Question Breakdown</h3>
          {interviewData.responses.map((response, index) => (
            <div key={index} className="border-b border-gray-200 last:border-0 py-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">Question {index + 1}</h4>
                {response.feedback?.score && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Score: {response.feedback.score}/10
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-2">{response.question}</p>
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <p className="text-gray-700"><span className="font-medium">Your Answer:</span> {response.answer}</p>
                {response.feedback?.strengths && (
                  <p className="text-green-600 mt-1">✓ {response.feedback.strengths}</p>
                )}
                {response.feedback?.weaknesses && (
                  <p className="text-red-600 mt-1">✗ {response.feedback.weaknesses}</p>
                )}
                {response.feedback?.suggestions && (
                  <p className="text-blue-600 mt-1">💡 {response.feedback.suggestions}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Link
          href="/dashboard"
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Dashboard
        </Link>
        <Link
          href="/interview/new"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Practice Again
        </Link>
      </div>
    </div>
  );
}