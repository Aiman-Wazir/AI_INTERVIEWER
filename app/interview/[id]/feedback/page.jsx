'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Home, RefreshCw, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

export default function FeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const interviewId = params.id;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (session && interviewId) {
      fetchFeedback();
    }
  }, [session, status, interviewId, router, retryCount]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching feedback for interview:', interviewId);
      
      const response = await fetch(`/api/interview/feedback?interviewId=${interviewId}`);
      const data = await response.json();
      
      console.log('Feedback response:', data);
      
      if (!data.success) {
        setError(data.error || 'Failed to load feedback');
        return;
      }
      
      if (!data.overallFeedback) {
        setError('No feedback available for this interview');
        return;
      }
      
      setFeedback(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError('Failed to load feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#6c5ce7] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading feedback...</p>
        </div>
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error || 'No feedback available'}</p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-[#6c5ce7] text-white rounded-lg hover:bg-[#5a4bd1] transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
            <Link
              href="/dashboard"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const overallFeedback = feedback.overallFeedback || feedback;
  const interviewData = feedback.interview || feedback;

  const totalQuestions = interviewData.questions?.length || 0;
  const answeredQuestions = interviewData.responses?.length || 0;
  const score = overallFeedback.averageScore || 0;
  const scoreColor = score >= 8 ? 'text-emerald-600' : score >= 6 ? 'text-blue-600' : score >= 4 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Interview Feedback</h1>
          <p className="text-sm text-gray-500">
            {interviewData.jobRole || 'Interview'} • {interviewData.experience || 0} years experience
          </p>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
      </div>

      {/* Overall Score Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Overall Score</p>
            <div className="flex items-end gap-2">
              <span className={`text-4xl font-bold ${scoreColor}`}>
                {score || '—'}
              </span>
              <span className="text-gray-400 text-sm">/ 10</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {answeredQuestions} of {totalQuestions} questions answered
            </p>
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#fd79a8] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {score || '—'}
          </div>
        </div>
      </div>

      {/* Summary */}
      {overallFeedback.overallSummary && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
          <p className="text-blue-800 text-sm">{overallFeedback.overallSummary}</p>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-emerald-800">Strengths</h3>
          </div>
          {overallFeedback.strengths && overallFeedback.strengths.length > 0 ? (
            <ul className="space-y-1.5">
              {overallFeedback.strengths.map((item, index) => (
                <li key={index} className="text-sm text-emerald-700 flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-emerald-600">No strengths recorded</p>
          )}
        </div>

        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Areas for Improvement</h3>
          </div>
          {overallFeedback.weaknesses && overallFeedback.weaknesses.length > 0 ? (
            <ul className="space-y-1.5">
              {overallFeedback.weaknesses.map((item, index) => (
                <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-red-600">No weaknesses identified</p>
          )}
        </div>
      </div>

      {/* Suggestions */}
      {overallFeedback.suggestions && overallFeedback.suggestions.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-800">Suggestions</h3>
          </div>
          <ul className="space-y-1.5">
            {overallFeedback.suggestions.map((item, index) => (
              <li key={index} className="text-sm text-amber-700 flex items-start gap-2">
                <span className="text-amber-400">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Question Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Question Breakdown</h3>
        <div className="space-y-4">
          {interviewData.responses && interviewData.responses.length > 0 ? (
            interviewData.responses.map((response, index) => (
              <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-medium text-gray-700">
                    Q{index + 1}: {response.question}
                  </p>
                  {response.feedback?.score && (
                    <span className={`text-sm font-bold ${
                      response.feedback.score >= 8 ? 'text-emerald-600' :
                      response.feedback.score >= 6 ? 'text-blue-600' :
                      response.feedback.score >= 4 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {response.feedback.score}/10
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded-lg">
                  {response.answer}
                </p>
                {response.feedback?.strengths && (
                  <p className="text-xs text-emerald-600 mt-1">✓ {response.feedback.strengths}</p>
                )}
                {response.feedback?.weaknesses && (
                  <p className="text-xs text-red-600">✗ {response.feedback.weaknesses}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No responses recorded</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-6">
        <Link
          href="/interview/new"
          className="px-6 py-2.5 bg-[#6c5ce7] text-white rounded-lg hover:bg-[#5a4bd1] transition-colors text-sm font-medium"
        >
          Practice Again
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          Go to Dashboard
        </Link>
        <button
          onClick={handleRetry}
          className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>
    </div>
  );
}