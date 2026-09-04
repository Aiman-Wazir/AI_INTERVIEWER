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
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">SkillPilot AI</span>
            </div>
            <div className="w-7 h-7 bg-slate-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-xl shadow-slate-200/30' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold gradient-text hidden sm:block">SkillPilot AI</span>
              <span className="text-lg font-bold gradient-text block sm:hidden">SP</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {status === 'loading' ? (
              <div className="w-7 h-7 bg-slate-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center gap-3">
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link 
                  href="/interview/new" 
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  New Interview
                </Link>
                <div className="flex items-center gap-2 pl-3 border-l border-slate-200/50">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={28}
                      height={28}
                      className="rounded-full ring-2 ring-blue-500/20"
                    />
                  )}
                  <div className="hidden lg:block">
                    <p className="text-xs font-medium text-slate-700">
                      {session.user?.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {session.user?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50/80 hover:text-rose-600 transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="btn-primary text-xs py-1.5 px-3"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-100/80 transition-all"
          >
            {isOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-2 pb-3 pt-2 border-t border-slate-200/50 glass rounded-2xl px-3 space-y-1.5 shadow-lg">
            {session ? (
              <>
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/50">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-700">{session.user?.name}</p>
                    <p className="text-xs text-slate-500">{session.user?.email}</p>
                  </div>
                </div>
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2.5 w-full py-1.5 px-3 rounded-lg hover:bg-slate-100/80 text-sm font-medium text-slate-700 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link 
                  href="/interview/new" 
                  className="flex items-center gap-2.5 w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-medium transition-all"
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
                  className="flex items-center gap-2.5 w-full text-left py-1.5 px-3 rounded-lg text-sm text-rose-500 font-medium hover:bg-rose-50/80 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center justify-center w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-medium"
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
      <body className="antialiased pt-14">
        <SessionProvider>
          <div className="min-h-screen">
            <NavBar />
            <main className="container mx-auto px-4 py-6 max-w-6xl">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}