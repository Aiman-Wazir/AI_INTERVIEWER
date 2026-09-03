'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
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
  Star,
  Target,
  Sparkles,
  CheckCircle2,
  Heart,
  Smile,
  Coffee
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
      const q = query(
        collection(db, 'interviews'),
        where('userId', '==', session?.user?.id || session?.user?.email),
        orderBy('startTime', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const interviewsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInterviews(interviewsData);
      
      const completed = interviewsData.filter(i => i.status === 'completed');
      const inProgress = interviewsData.filter(i => i.status === 'in-progress');
      const scores = completed.map(i => i.overallFeedback?.averageScore || 0).filter(s => s > 0);
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      
      setStats({
        total: interviewsData.length,
        completed: completed.length,
        averageScore: Math.round(avgScore * 10) / 10,
        inProgress: inProgress.length
      });
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return <span className="badge badge-success">✨ Completed</span>;
    } else if (status === 'in-progress') {
      return <span className="badge badge-warning">🌱 In Progress</span>;
    } else {
      return <span className="badge badge-soft">📝 Not Started</span>;
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
          <div className="w-12 h-12 border-3 border-[#6c5ce7] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-[#b2a8a0] mt-4">Loading your practice space...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const hasInterviews = interviews.length > 0;

  // Get time-based greeting
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  let emoji = '🌅';
  if (hour >= 12 && hour < 17) { greeting = 'Good afternoon'; emoji = '☀️'; }
  else if (hour >= 17) { greeting = 'Good evening'; emoji = '🌙'; }

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Welcome Section - Warm & Personal */}
      <div className="glass rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] flex items-center justify-center shadow-md shadow-[#6c5ce7]/15">
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
                {greeting}, <span className="gradient-text">{session.user?.name?.split(' ')[0] || 'User'}</span> {emoji}
              </h1>
              <p className="text-sm text-[#b2a8a0] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#6c5ce7]" />
                Ready to grow your interview skills today?
              </p>
            </div>
          </div>
          <Link
            href="/interview/new"
            className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5"
          >
            <PlusCircle className="w-4 h-4" />
            Start Practice
          </Link>
        </div>
      </div>

      {/* Stats Grid - Warm Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#b2a8a0] uppercase tracking-wider">Total</p>
              <p className="text-2xl font-bold text-[#1a1a2e] mt-1">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#6c5ce7]/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#6c5ce7]" />
            </div>
          </div>
          <p className="text-xs text-[#b2a8a0] mt-2">
            {stats.total > 0 ? `${stats.total} interviews taken` : 'Start your journey'}
          </p>
        </div>

        <div className="glass rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#b2a8a0] uppercase tracking-wider">Done</p>
              <p className="text-2xl font-bold text-[#1a1a2e] mt-1">{stats.completed}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-xs text-[#b2a8a0] mt-2">
            {stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% completion` : 'Start your first'}
          </p>
        </div>

        <div className="glass rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#b2a8a0] uppercase tracking-wider">Avg Score</p>
              <p className={`text-2xl font-bold mt-1 ${getScoreColor(stats.averageScore)}`}>
                {stats.averageScore > 0 ? stats.averageScore : '—'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-[#b2a8a0] mt-2">
            {stats.averageScore > 0 ? `Out of 10` : 'No scores yet'}
          </p>
        </div>

        <div className="glass rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#b2a8a0] uppercase tracking-wider">In Progress</p>
              <p className="text-2xl font-bold text-[#1a1a2e] mt-1">{stats.inProgress}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#f8e8d8]/60 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-[#b2a8a0]" />
            </div>
          </div>
          <p className="text-xs text-[#b2a8a0] mt-2">
            {stats.inProgress > 0 ? 'Keep going! 🚀' : 'All clear ✨'}
          </p>
        </div>
      </div>

      {/* Recent Interviews */}
      <div className="glass rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6c5ce7]/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#6c5ce7]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1a1a2e]">Recent Practice</h2>
            </div>
          </div>
          {hasInterviews && (
            <button className="text-xs text-[#6c5ce7] hover:text-[#4a3db8] font-medium flex items-center gap-1">
              View All
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {!hasInterviews ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-xl bg-[#6c5ce7]/10 flex items-center justify-center mx-auto mb-4">
              <Smile className="w-8 h-8 text-[#6c5ce7]" />
            </div>
            <h3 className="text-base font-semibold text-[#1a1a2e] mb-1">Your practice space is ready</h3>
            <p className="text-sm text-[#b2a8a0] max-w-sm mx-auto">
              Start your first mock interview and get gentle, human-like feedback to help you grow.
            </p>
            <Link
              href="/interview/new"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] text-white text-sm font-medium rounded-xl hover:from-[#5a4bd1] hover:to-[#8c84e0] transition-all shadow-sm"
            >
              <Heart className="w-4 h-4" />
              Start Your First Interview
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {interviews.slice(0, 5).map((interview) => (
              <Link
                key={interview.id}
                href={`/interview/${interview.id}`}
                className="block group"
              >
                <div className="bg-white/50 border border-[#f0e8e0] rounded-xl p-4 hover:shadow-sm hover:border-[#d4c8bd] transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#6c5ce7]/10 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-4 h-4 text-[#6c5ce7]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-[#1a1a2e] group-hover:text-[#6c5ce7] transition-colors">
                          {interview.jobRole || 'Untitled'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          <span className="text-xs text-[#b2a8a0] flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {interview.startTime ? new Date(interview.startTime).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric'
                            }) : 'N/A'}
                          </span>
                          <span className="text-xs text-[#d4c8bd]">•</span>
                          <span className="text-xs text-[#b2a8a0]">
                            {interview.responses?.length || 0}/{interview.questions?.length || 0}
                          </span>
                          <span className="text-xs text-[#d4c8bd]">•</span>
                          {getStatusBadge(interview.status)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-12 sm:ml-0">
                      {interview.overallFeedback?.averageScore && (
                        <div className={`text-lg font-bold ${getScoreColor(interview.overallFeedback.averageScore)}`}>
                          {interview.overallFeedback.averageScore}
                        </div>
                      )}
                      <ChevronRight className="w-4 h-4 text-[#d4c8bd] group-hover:text-[#6c5ce7] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions - Warm & Friendly */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/interview/new"
          className="glass rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6c5ce7]/10 flex items-center justify-center group-hover:bg-[#6c5ce7]/20 transition-colors">
              <PlusCircle className="w-5 h-5 text-[#6c5ce7]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1a1a2e]">Practice</h4>
              <p className="text-xs text-[#b2a8a0]">Start a new interview</p>
            </div>
          </div>
        </Link>

        <div className="glass rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1a1a2e]">Growth</h4>
              <p className="text-xs text-[#b2a8a0]">Track your progress</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <Heart className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1a1a2e]">Tips</h4>
              <p className="text-xs text-[#b2a8a0]">Gentle advice</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}