'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Briefcase, 
  Calendar, 
  Wrench, 
  ArrowRight, 
  Sparkles,
  Loader2,
  CheckCircle2,
  Zap,
  Brain,
  Code,
  Users,
  Shield
} from 'lucide-react';

export default function NewInterview() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobRole, setJobRole] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  const startInterview = async () => {
    if (!jobRole || !experience || !skills) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('🚀 Starting interview with:', { jobRole, experience, skills });
      
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          jobRole,
          experience: parseInt(experience),
          skills: skills.split(',').map(s => s.trim()),
          userId: session?.user?.id || 'anonymous'
        })
      });
      
      const data = await response.json();
      console.log('📦 Response:', data);
      
      if (!data.success) {
        setError(data.error || 'Failed to start interview');
        setLoading(false);
        return;
      }
      
      if (data.interviewId) {
        console.log('✅ Redirecting to interview:', data.interviewId);
        router.push(`/interview/${data.interviewId}`);
      } else {
        setError('No interview ID received');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleSuggestions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Machine Learning Engineer",
    "Data Scientist",
    "DevOps Engineer",
    "Product Manager",
    "UI/UX Designer",
    "Mobile Developer",
    "QA Engineer"
  ];

  const skillSuggestions = [
    "React, Next.js, TypeScript",
    "Node.js, Express, MongoDB",
    "Python, Django, PostgreSQL",
    "Java, Spring Boot, MySQL",
    "AWS, Docker, Kubernetes",
    "TensorFlow, PyTorch, Python",
    "React Native, Firebase",
    "C#, .NET, SQL Server",
    "Go, Microservices, Redis",
    "R, Python, TensorFlow"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-grid"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">AI-Powered Interview</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
            Start Your <span className="gradient-text">Mock Interview</span>
          </h1>
          <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
            Fill in the details below and let our AI interviewer guide you through a realistic interview experience.
          </p>
        </div>

        {/* Main Card */}
        <div className="glass rounded-3xl p-6 md:p-10 shadow-2xl shadow-slate-200/50 max-w-2xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Job Role */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  Job Role *
                </span>
              </label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g., Frontend Developer"
                className="input-modern"
                list="job-roles"
              />
              <datalist id="job-roles">
                {roleSuggestions.map((role, i) => (
                  <option key={i} value={role} />
                ))}
              </datalist>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  Years of Experience *
                </span>
              </label>
              <input
                type="number"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g., 3"
                min="0"
                max="50"
                className="input-modern"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <span className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-500" />
                  Skills (comma separated) *
                </span>
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., React, Next.js, TypeScript"
                className="input-modern"
                list="skills"
              />
              <datalist id="skills">
                {skillSuggestions.map((skill, i) => (
                  <option key={i} value={skill} />
                ))}
              </datalist>
              <p className="text-xs text-slate-400 mt-1.5">
                Enter skills separated by commas
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">What to expect</h4>
                  <ul className="text-sm text-slate-600 mt-1 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      5 questions tailored to your role and skills
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      Real-time feedback after each answer
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      Overall performance summary at the end
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startInterview}
              disabled={!jobRole || !experience || !skills || loading}
              className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Preparing Interview...</span>
                </>
              ) : (
                <>
                  <span>Start Interview</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Features Footer */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="glass rounded-2xl p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-slate-700 text-sm">Adaptive Questions</h4>
            <p className="text-xs text-slate-500 mt-1">Tailored to your role and skills</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-slate-700 text-sm">Instant Feedback</h4>
            <p className="text-xs text-slate-500 mt-1">AI-powered analysis in real-time</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-slate-700 text-sm">Track Progress</h4>
            <p className="text-xs text-slate-500 mt-1">Monitor your improvement over time</p>
          </div>
        </div>
      </div>
    </div>
  );
}