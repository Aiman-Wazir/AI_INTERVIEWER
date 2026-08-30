'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, LogOut, LayoutDashboard, PlusCircle } from 'lucide-react';

function NavBar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700  flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">AI Mock Interviewer</span>
          </div>
          <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-xl shadow-slate-200/30' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700  flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold gradient-text hidden sm:block">AI Mock Interviewer</span>
              <span className="text-xl font-bold gradient-text block sm:hidden">AI MI</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center gap-4">
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link 
                  href="/interview/new" 
                  className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  New Interview
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200/50">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={36}
                      height={36}
                      className="rounded-full ring-2 ring-blue-500/20"
                    />
                  )}
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-slate-700">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {session.user?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50/80 hover:text-rose-600 transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="btn-primary text-sm py-2 px-4"
              >
                ✨ Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-slate-100/80 transition-all"
          >
            {isOpen ? <X className="w-6 h-6 text-slate-600" /> : <Menu className="w-6 h-6 text-slate-600" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-200/50 glass rounded-2xl p-4 space-y-2">
            {session ? (
              <>
                <div className="flex items-center gap-3 pb-3 border-b border-slate-200/50">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium text-slate-700">{session.user?.name}</p>
                    <p className="text-sm text-slate-500">{session.user?.email}</p>
                  </div>
                </div>
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-3 w-full py-2.5 px-4 rounded-xl hover:bg-slate-100/80 font-medium text-slate-700 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link 
                  href="/interview/new" 
                  className="flex items-center gap-3 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <PlusCircle className="w-4 h-4" />
                  New Interview
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 w-full text-left py-2.5 px-4 rounded-xl text-rose-500 font-medium hover:bg-rose-50/80 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium"
                onClick={() => setIsOpen(false)}
              >
                ✨ Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased pt-20">
        <SessionProvider>
          <div className="min-h-screen">
            <NavBar />
            <main>
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}