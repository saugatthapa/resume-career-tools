'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  name: string | null;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser({
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name,
      });
    } else {
      setShowAuthModal(true);
    }
    setLoading(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoadingAuth(true);
    
    try {
      if (isSignup) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name || email.split('@')[0] } }
        });
        
        if (signUpError) {
          setError(signUpError.message);
          setLoadingAuth(false);
          return;
        }
        
        setShowAuthModal(false);
        await checkAuth();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        
        if (signInError) {
          setError(signInError.message);
          setLoadingAuth(false);
          return;
        }
        
        setShowAuthModal(false);
        await checkAuth();
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setLoadingAuth(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1F4D3F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1F4D3F] to-[#2D6B56] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isSignup ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="text-gray-500 mt-2">
                {isSignup ? 'Start building your professional resume' : 'Sign in to continue'}
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleAuth} className="space-y-5">
              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20 focus:border-[#1F4D3F] transition"
                    placeholder="John Doe"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20 focus:border-[#1F4D3F] transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20 focus:border-[#1F4D3F] transition"
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={loadingAuth}
                className="w-full py-3.5 bg-[#1F4D3F] text-white rounded-xl font-semibold hover:bg-[#1a4535] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingAuth ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  isSignup ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-500">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}
              </p>
              <button
                type="button"
                onClick={() => { setIsSignup(!isSignup); setError(''); }}
                className="mt-2 text-[#1F4D3F] font-semibold hover:underline"
              >
                {isSignup ? 'Sign in instead' : 'Create one now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1F4D3F] to-[#2D6B56] rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-900">ResumeCraft</span>
            </Link>
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
                    <p className="text-xs text-gray-500">Free Plan</p>
                  </div>
                  <div className="w-10 h-10 bg-[#1F4D3F]/10 rounded-full flex items-center justify-center">
                    <span className="text-[#1F4D3F] font-semibold text-sm">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'there'}!
          </h1>
          <p className="text-gray-600">What would you like to work on today?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link href="/resume-builder" className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#1F4D3F]/30 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-[#1F4D3F] to-[#2D6B56] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Create Resume</h3>
            <p className="text-gray-600">Build a new professional resume with our step-by-step wizard</p>
            <div className="mt-4 flex items-center text-[#1F4D3F] font-medium">
              Start building
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link href="/cover-letter" className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-purple-500/30 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-5 7V3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cover Letter</h3>
            <p className="text-gray-600">Generate a tailored cover letter for any job application</p>
            <div className="mt-4 flex items-center text-purple-600 font-medium">
              Create letter
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link href="/ai-tools" className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-amber-500/30 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 3v4m-3-3h4m9-3v4m-3-3h4m2.5 9.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI Tools</h3>
            <p className="text-gray-600">Get AI-powered suggestions for your resume content</p>
            <div className="mt-4 flex items-center text-amber-600 font-medium">
              Try AI tools
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Your Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#1F4D3F] mb-1">0</div>
              <p className="text-sm text-gray-500">Resumes Created</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">2</div>
              <p className="text-sm text-gray-500">Downloads Left Today</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">Free</div>
              <p className="text-sm text-gray-500">Current Plan</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
              <p className="text-sm text-gray-500">Applications Sent</p>
            </div>
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="bg-gradient-to-br from-[#1F4D3F] to-[#2D6B56] rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Unlock Your Full Potential</h3>
              <p className="text-white/80">Get unlimited downloads, all templates, and priority AI access with Pro</p>
            </div>
            <Link href="/pricing" className="px-8 py-3 bg-white text-[#1F4D3F] rounded-xl font-semibold hover:bg-gray-100 transition whitespace-nowrap">
              Upgrade to Pro - $5/mo
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}