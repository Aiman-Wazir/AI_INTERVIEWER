'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import InterviewChat from '@/components/InterviewChat';

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const interviewId = params.id;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (session && interviewId) {
      fetchInterviewData();
    }
  }, [session, status, interviewId, router]);

  const fetchInterviewData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/interview?action=get-status&interviewId=${interviewId}`);
      const data = await response.json();
      
      console.log('📦 Interview data:', data);
      
      if (!data.success) {
        setError(data.error || 'Failed to load interview');
        return;
      }
      
      if (!data.questions || data.questions.length === 0) {
        setError('This interview has no questions. Please start a new one.');
        return;
      }
      
      // ✅ If interview is already completed, redirect to feedback
      if (data.status === 'completed') {
        console.log('✅ Interview already completed, redirecting to feedback...');
        router.push(`/interview/${interviewId}/feedback`);
        return;
      }
      
      setInterviewData(data);
    } catch (error) {
      console.error('Error fetching interview:', error);
      setError('Failed to load interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    console.log('🎉 Interview complete, redirecting to feedback...');
    router.push(`/interview/${interviewId}/feedback`);
  };

  const handleStartNew = () => {
    router.push('/interview/new');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#6c5ce7] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleStartNew}
              className="px-4 py-2 bg-[#6c5ce7] text-white rounded-lg hover:bg-[#5a4bd1] transition-colors"
            >
              Start New Interview
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Interview not found</p>
          <button
            onClick={handleStartNew}
            className="mt-4 px-4 py-2 bg-[#6c5ce7] text-white rounded-lg hover:bg-[#5a4bd1] transition-colors"
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {interviewData.jobRole || 'Interview'} Interview
          </h1>
          <p className="text-gray-600">
            {interviewData.experience || 0} years experience • Skills: {Array.isArray(interviewData.skills) ? interviewData.skills.join(', ') : interviewData.skills || 'N/A'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Progress: {interviewData.responses?.length || 0} / {interviewData.questions?.length || 0} questions answered
          </p>
        </div>
        
        <InterviewChat
          interviewId={interviewId}
          jobRole={interviewData.jobRole || 'Developer'}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}