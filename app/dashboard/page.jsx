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
  BarChart3,
  Target,
  Sparkles,
  CheckCircle2,
  ArrowUpRight
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
      return <span className="badge badge-success">Completed</span>;
    } else if (status === 'in-progress') {
      return <span className="badge badge-warning">In Progress</span>;
    } else {
      return <span className="badge badge-info">Not Started</span>;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 4) return 'text-amber-600';
    return 'text-rose-600';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-500 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const hasInterviews = interviews.length > 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Section */}
      <div className="glass rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              ) : (
                <span className="text-lg font-bold text-white">
                  {session.user?.name?.[0] || 'U'}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Welcome back, <span className="gradient-text">{session.user?.name?.split(' ')[0] || 'User'}</span>
              </h1>
              <p className="text-sm text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                Ready to practice?
              </p>
            </div>
          </div>
          <Link
            href="/interview/new"
            className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5"
          >
            <PlusCircle className="w-4 h-4" />
            New Interview
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {stats.total > 0 ? 'All interviews' : 'Start your first'}
          </p>
        </div>

        <div className="glass rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Completed</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stats.completed}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% done` : '0% done'}
          </p>
        </div>

        <div className="glass rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Avg Score</p>
              <p className={`text-2xl font-bold mt-1 ${getScoreColor(stats.averageScore)}`}>
                {stats.averageScore > 0 ? stats.averageScore : '—'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {stats.averageScore > 0 ? `${stats.averageScore}/10` : 'No scores'}
          </p>
        </div>

        <div className="glass rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">In Progress</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stats.inProgress}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {stats.inProgress > 0 ? 'Finish your interview' : 'No active'}
          </p>
        </div>
      </div>

      {/* Recent Interviews */}
      <div className="glass rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Recent Interviews</h2>
            </div>
          </div>
          {hasInterviews && (
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {!hasInterviews ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
              <Target className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-base font-semibold text-slate-700 mb-1">No Interviews Yet</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Start your first mock interview and get AI-powered feedback.
            </p>
            <Link
              href="/interview/new"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Start First Interview
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
                <div className="bg-white/50 border border-white/50 rounded-xl p-4 hover:shadow-sm hover:border-slate-200/80 transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                          {interview.jobRole || 'Untitled'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {interview.startTime ? new Date(interview.startTime).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric'
                            }) : 'N/A'}
                          </span>
                          <span className="text-xs text-slate-300">•</span>
                          <span className="text-xs text-slate-500">
                            {interview.responses?.length || 0}/{interview.questions?.length || 0}
                          </span>
                          <span className="text-xs text-slate-300">•</span>
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
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/interview/new"
          className="glass rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <PlusCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">New Interview</h4>
              <p className="text-xs text-slate-500">Practice with AI</p>
            </div>
          </div>
        </Link>

        <div className="glass rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Analytics</h4>
              <p className="text-xs text-slate-500">Track progress</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Tips</h4>
              <p className="text-xs text-slate-500">Interview advice</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}