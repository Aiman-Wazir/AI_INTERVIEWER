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
  Shield,
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
      {/* Warm Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#6c5ce7]/10 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-[#fd79a8]/10 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#fdcb6e]/10 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-grid-warm"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] flex items-center justify-center shadow-lg shadow-[#6c5ce7]/20">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">SkillPilot AI</h1>
              <p className="text-sm text-[#b2a8a0]">Practice with heart</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight text-[#1a1a2e]">
              Grow with
              <span className="gradient-text block">Confidence & Ease</span>
            </h2>
            
            <p className="text-base text-[#636e72] leading-relaxed">
              Practice with our warm, human-like AI interviewer. Get gentle feedback 
              and build the confidence you need for your next opportunity.
            </p>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-[#2d3436]">
                  <div className="w-8 h-8 rounded-lg bg-[#6c5ce7]/10 flex items-center justify-center text-[#6c5ce7]">
                    {feature.icon}
                  </div>
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-2xl font-bold text-[#1a1a2e]">10K+</div>
                <div className="text-xs text-[#b2a8a0]">Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1a1a2e]">50K+</div>
                <div className="text-xs text-[#b2a8a0]">Interviews</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1a1a2e]">95%</div>
                <div className="text-xs text-[#b2a8a0]">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="glass rounded-3xl p-8 md:p-10 shadow-lg shadow-[#6c5ce7]/5">
          <div className="text-center mb-8">
            <div className="lg:hidden flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] flex items-center justify-center shadow-lg shadow-[#6c5ce7]/20">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#1a1a2e]">Welcome to SkillPilot AI</h2>
            <p className="text-sm text-[#b2a8a0] mt-1">Let's continue your growth journey</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50/80 border border-rose-200/80 rounded-xl text-rose-700 text-sm">
              {error === 'OAuthSignin' && 'Error signing in. Please try again.'}
              {error === 'OAuthCallback' && 'Error during authentication.'}
              {error === 'OAuthCreateAccount' && 'Could not create account.'}
              {error === 'AccessDenied' && 'Access denied.'}
              {error === 'CredentialsSignin' && 'Invalid email or password.'}
              {!['OAuthSignin', 'OAuthCallback', 'OAuthCreateAccount', 'AccessDenied', 'CredentialsSignin'].includes(error) && 'An error occurred. Please try again.'}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="btn-google"
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
            <span>Continue with Google</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#f0e8e0]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 text-[#b2a8a0]">or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2d3436] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Mail className="w-5 h-5 text-[#b2a8a0]" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/90 border border-[#f0e8e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/20 focus:border-[#6c5ce7] hover:border-[#d4c8bd] transition-all duration-200 placeholder:text-[#b2a8a0] text-[#1a1a2e] text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2d3436] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Lock className="w-5 h-5 text-[#b2a8a0]" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white/90 border border-[#f0e8e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/20 focus:border-[#6c5ce7] hover:border-[#d4c8bd] transition-all duration-200 placeholder:text-[#b2a8a0] text-[#1a1a2e] text-sm"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2"
            >
              {isLoading ? (
                'Loading...'
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-[#b2a8a0] hover:text-[#6c5ce7] transition-colors flex items-center justify-center gap-1"
            >
              <Coffee className="w-3.5 h-3.5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}