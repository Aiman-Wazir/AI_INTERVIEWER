'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, LayoutDashboard, PlusCircle, User, ChevronDown } from 'lucide-react';

function NavBar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6c5ce7] to-[#fd79a8] flex items-center justify-center">
                <Image src="/logo.svg" alt="SkillPilot AI" width={28} height={28} className="w-7 h-7" />
              </div>
              <div>
                <span className="text-base font-bold text-gray-800">SkillPilot</span>
                <span className="text-xs font-semibold text-[#6c5ce7] ml-0.5">AI</span>
              </div>
            </div>
            <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6c5ce7] to-[#fd79a8] flex items-center justify-center shadow-lg shadow-[#6c5ce7]/25 group-hover:scale-105 transition-transform">
              <Image src="/logo.svg" alt="SkillPilot AI" width={28} height={28} className="w-7 h-7" />
            </div>
            <div>
              <span className="text-base font-bold text-gray-800">SkillPilot</span>
              <span className="text-xs font-semibold text-[#6c5ce7] ml-0.5">AI</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {status === 'loading' ? (
              <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <>
                {/* Dashboard Link - Clean */}
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-[#6c5ce7] hover:bg-[#6c5ce7]/5 transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                
                {/* New Interview Button - Compact */}
                <Link 
                  href="/interview/new" 
                  className="bg-gradient-to-r from-[#6c5ce7] to-[#fd79a8] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-[#6c5ce7]/25 transition-all flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>New</span>
                </Link>

                {/* User Profile - Clean Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1.5 pl-3 ml-1 border-l border-gray-200 hover:opacity-80 transition-opacity"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={28}
                        height={28}
                        className="rounded-full ring-2 ring-[#6c5ce7]/20"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#fd79a8] flex items-center justify-center text-white text-xs font-bold">
                        {session.user?.name?.[0] || 'U'}
                      </div>
                    )}
                    <span className="text-xs font-medium text-gray-700 max-w-[80px] truncate">
                      {session.user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-medium text-gray-800 truncate">{session.user?.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{session.user?.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-1.5 text-sm text-gray-600 hover:bg-[#6c5ce7]/5 hover:text-[#6c5ce7] transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-1.5 text-sm text-red-500 hover:bg-red-50/80 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-gradient-to-r from-[#6c5ce7] to-[#fd79a8] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-[#6c5ce7]/25 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100/80 transition-all"
          >
            {isOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-2 pb-3 pt-2 border-t border-gray-200/50 bg-white/90 backdrop-blur-lg rounded-xl px-3 space-y-1.5 shadow-lg">
            {session ? (
              <>
                <div className="flex items-center gap-3 pb-2 border-b border-gray-200/50">
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
                    <p className="text-sm font-medium text-gray-800">{session.user?.name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{session.user?.email}</p>
                  </div>
                </div>
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2.5 w-full py-2 px-3 rounded-lg hover:bg-gray-100/80 text-sm font-medium text-gray-700 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link 
                  href="/interview/new" 
                  className="flex items-center gap-2.5 w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#6c5ce7] to-[#fd79a8] text-white text-sm font-medium transition-all"
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
                  className="flex items-center gap-2.5 w-full text-left py-2 px-3 rounded-lg text-sm text-red-500 font-medium hover:bg-red-50/80 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center justify-center w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#6c5ce7] to-[#fd79a8] text-white text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                Sign In
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
      <body className="pt-14 bg-gray-50">
        <SessionProvider>
          <NavBar />
          <main className="container mx-auto px-4 py-6 max-w-6xl">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}