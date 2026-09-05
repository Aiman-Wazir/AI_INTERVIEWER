'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  PlusCircle, 
  TrendingUp, 
  Award, 
  Clock, 
  Briefcase,
  Calendar,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Heart,
  Coffee,
  Trash2
} from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    averageScore: 0,
    inProgress: 0
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchInterviews();
    }
  }, [session]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/interview?action=list');
      const data = await response.json();
      
      console.log('Dashboard data:', data);
      
      if (data.success && data.interviews) {
        setInterviews(data.interviews);
        
        const completed = data.interviews.filter(i => i.status === 'completed');
        const inProgress = data.interviews.filter(i => i.status === 'in-progress');
        
        let totalScore = 0;
        let scoreCount = 0;
        completed.forEach(interview => {
          if (interview.overallFeedback?.averageScore) {
            totalScore += interview.overallFeedback.averageScore;
            scoreCount++;
          }
        });
        const avgScore = scoreCount > 0 ? totalScore / scoreCount : 0;
        
        setStats({
          total: data.interviews.length,
          completed: completed.length,
          averageScore: Math.round(avgScore * 10) / 10,
          inProgress: inProgress.length
        });
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (interviewId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this interview?')) return;
    
    try {
      const response = await fetch(`/api/interview?action=delete&interviewId=${interviewId}`);
      if (response.ok) {
        fetchInterviews();
      }
    } catch (error) {
      console.error('Error deleting interview:', error);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Completed</span>;
    } else if (status === 'in-progress') {
      return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">In Progress</span>;
    } else {
      return <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">Not Started</span>;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-600';
    if (score >= 6) return 'text-[#6c5ce7]';
    if (score >= 4) return 'text-amber-600';
    return 'text-rose-600';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#6c5ce7] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-400 mt-4">Loading your practice space...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const hasInterviews = interviews.length > 0;

  const hour = new Date().getHours();
  let greeting = 'Good morning';
  let emoji = '';
  if (hour >= 12 && hour < 17) { greeting = 'Good afternoon'; emoji = ''; }
  else if (hour >= 17) { greeting = 'Good evening'; emoji = ''; }

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#fd79a8] flex items-center justify-center shadow-md shadow-[#6c5ce7]/15">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <span className="text-xl font-bold text-white">
                  {session.user?.name?.[0] || 'U'}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1a1a2e]">
                {greeting}, <span className="bg-gradient-to-r from-[#6c5ce7] to-[#fd79a8] bg-clip-text text-transparent">{session.user?.name?.split(' ')[0] || 'User'}</span> {emoji}
              </h1>
              <p className="text-sm text-gray-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#6c5ce7]" />
                Ready to grow your interview skills today?
              </p>
            </div>
          </div>
          <Link
            href="/interview/new"
            className="px-5 py-2.5 bg-gradient-to-r from-[#6c5ce7] to-[#fd79a8] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#6c5ce7]/25 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Start Practice
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total</p>
              <p className="text-2xl font-bold text-[#1a1a2e] mt-1">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#6c5ce7]/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#6c5ce7]" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {stats.total > 0 ? `${stats.total} interviews taken` : 'Start your journey'}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Done</p>
              <p className="text-2xl font-bold text-[#1a1a2e] mt-1">{stats.completed}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% completion` : 'Start your first'}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Avg Score</p>
              <p className={`text-2xl font-bold mt-1 ${getScoreColor(stats.averageScore)}`}>
                {stats.averageScore > 0 ? stats.averageScore : '—'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {stats.averageScore > 0 ? `Out of 10` : 'No scores yet'}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">In Progress</p>
              <p className="text-2xl font-bold text-[#1a1a2e] mt-1">{stats.inProgress}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#f8e8d8]/60 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {stats.inProgress > 0 ? 'Keep going!' : 'All clear'}
          </p>
        </div>
      </div>

      {/* Recent Interviews */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6c5ce7]/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#6c5ce7]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1a1a2e]">Recent Practice</h2>
            </div>
          </div>
        </div>

        {!hasInterviews ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-xl bg-[#6c5ce7]/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-[#6c5ce7]" />
            </div>
            <h3 className="text-base font-semibold text-[#1a1a2e] mb-1">Your practice space is ready</h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              Start your first mock interview and get gentle feedback to help you grow.
            </p>
            <Link
              href="/interview/new"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-gradient-to-r from-[#6c5ce7] to-[#fd79a8] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#6c5ce7]/25 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Start Your First Interview
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {interviews.slice(0, 5).map((interview) => (
              <div key={interview.id} className="bg-white/50 border border-[#f0e8e0] rounded-xl p-4 hover:shadow-sm hover:border-[#d4c8bd] transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <Link
                    href={`/interview/${interview.id}`}
                    className="flex items-start sm:items-center gap-3 flex-1 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#6c5ce7]/10 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4 text-[#6c5ce7]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#1a1a2e] group-hover:text-[#6c5ce7] transition-colors">
                        {interview.jobRole || 'Untitled'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {interview.startTime ? new Date(interview.startTime).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric'
                          }) : 'N/A'}
                        </span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-400">
                          {interview.responses?.length || 0}/{interview.questions?.length || 0}
                        </span>
                        <span className="text-xs text-gray-300">•</span>
                        {getStatusBadge(interview.status)}
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-3 ml-12 sm:ml-0">
                    {interview.overallFeedback?.averageScore && (
                      <div className={`text-lg font-bold ${getScoreColor(interview.overallFeedback.averageScore)}`}>
                        {interview.overallFeedback.averageScore}
                      </div>
                    )}
                    <button
                      onClick={(e) => handleDelete(interview.id, e)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      title="Delete interview"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#6c5ce7] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/interview/new"
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50 hover:shadow-md transition-all duration-300 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6c5ce7]/10 flex items-center justify-center group-hover:bg-[#6c5ce7]/20 transition-colors">
              <PlusCircle className="w-5 h-5 text-[#6c5ce7]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1a1a2e]">Practice</h4>
              <p className="text-xs text-gray-400">Start a new interview</p>
            </div>
          </div>
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50 hover:shadow-md transition-all duration-300 group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1a1a2e]">Growth</h4>
              <p className="text-xs text-gray-400">Track your progress</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50 hover:shadow-md transition-all duration-300 group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <Heart className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1a1a2e]">Tips</h4>
              <p className="text-xs text-gray-400">Helpful advice</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}