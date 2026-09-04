'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles,
  Briefcase,
  Zap,
  Heart,
  Coffee
} from 'lucide-react';

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/dashboard',
    });

    if (result?.error) {
      alert('Invalid email or password');
      setIsLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  const features = [
    { icon: <Briefcase className="w-4 h-4" />, text: "AI-powered mock interviews" },
    { icon: <Zap className="w-4 h-4" />, text: "Real-time feedback & scoring" },
    { icon: <Heart className="w-4 h-4" />, text: "Gentle, human-like guidance" }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f6] flex items-center justify-center p-4">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#6c5ce7]/10 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-[#fd79a8]/10 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#a29bfe]/10 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-grid-warm"></div>
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6c5ce7] to-[#fd79a8] flex items-center justify-center shadow-lg shadow-[#6c5ce7]/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">SkillPilot AI</h1>
              <p className="text-sm text-gray-400">Your personal interview coach</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-tight text-gray-800">
              Grow with
              <span className="gradient-text block">Confidence & Ease</span>
            </h2>
            
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Practice with our warm, human-like AI interviewer. Get gentle feedback 
              and build the confidence you need for your next opportunity.
            </p>

            <div className="space-y-2.5">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-600">
                  <div className="w-7 h-7 rounded-lg bg-[#6c5ce7]/10 flex items-center justify-center text-[#6c5ce7]">
                    {feature.icon}
                  </div>
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            {/* <div className="flex gap-6 pt-3">
              <div>
                <div className="text-xl font-bold text-gray-800">10K+</div>
                <div className="text-xs text-gray-400">Users</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">50K+</div>
                <div className="text-xs text-gray-400">Interviews</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">95%</div>
                <div className="text-xs text-gray-400">Satisfaction</div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="w-full max-w-sm mx-auto lg:mx-0">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
                {error === 'CredentialsSignin' && 'Invalid email or password.'}
                {error === 'OAuthSignin' && 'Error signing in. Please try again.'}
                {error === 'AccessDenied' && 'Access denied.'}
                {!['CredentialsSignin', 'OAuthSignin', 'AccessDenied'].includes(error) && 'An error occurred. Please try again.'}
              </div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/20 focus:border-[#6c5ce7] transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/20 focus:border-[#6c5ce7] transition-all text-sm"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#6c5ce7] to-[#fd79a8] text-white py-3 rounded-xl hover:from-[#5a4bd1] hover:to-[#e86a98] transition-all text-sm font-medium shadow-md shadow-[#6c5ce7]/20 disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-xs text-gray-400">or</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={() => signIn('google', { callbackUrl })}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 font-medium text-sm">Continue with Google</span>
            </button>

            <div className="mt-5 text-center">
              <Link
                href="/"
                className="text-xs text-gray-400 hover:text-[#6c5ce7] transition-colors flex items-center justify-center gap-1"
              >
                <Coffee className="w-3 h-3" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}