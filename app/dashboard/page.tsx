'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  name: string | null;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [resumes, setResumes] = useState<any[]>([]);

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
      loadResumes(session.access_token);
    } else {
      setShowAuthModal(true);
    }
    setLoading(false);
  };

  const loadResumes = async (token: string) => {
    try {
      const res = await fetch('/api/resume', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(data);
      }
    } catch (err) {
      console.error('Error loading resumes:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name || email.split('@')[0] } }
        });
        
        if (signUpError) {
          setError(signUpError.message);
          return;
        }
        
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.name,
          });
          setShowAuthModal(false);
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          setError(signInError.message);
          return;
        }
        
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name,
        });
        setShowAuthModal(false);
        loadResumes(data.session.access_token);
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setResumes([]);
    window.location.href = '/';
  };

  const deleteResume = async (id: number) => {
    if (!confirm('Delete this resume?')) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      await fetch(`/api/resume/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      setResumes(resumes.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Error deleting resume:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="w-8 h-8 border-4 border-[#1F4D3F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-500 mb-6">
              {isSignup ? 'Start building your professional resume' : 'Sign in to continue'}
            </p>
            
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-lg" placeholder="Your name" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-lg" placeholder="you@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-lg" placeholder="••••••••" required />
              </div>
              <button type="submit" className="w-full py-3 bg-[#1F4D3F] text-white rounded-lg font-semibold hover:bg-opacity-90">
                {isSignup ? 'Create Account' : 'Sign In'}
              </button>
            </form>
            
            <p className="mt-6 text-center text-gray-600">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <button type="button" onClick={() => { setIsSignup(!isSignup); setError(''); }} className="text-[#1F4D3F] font-medium ml-1">
                {isSignup ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#1F4D3F] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <span className="font-semibold text-gray-900">ResumeTools</span>
          </Link>
          <div className="flex items-center gap-4">
            {user && <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">Sign out</button>}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!user ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#1F4D3F]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#1F4D3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome back</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Sign in to access your resumes, cover letters, and AI career tools.</p>
            <button onClick={() => setShowAuthModal(true)} className="px-6 py-3 bg-[#1F4D3F] text-white rounded-lg font-medium hover:bg-opacity-90">Get Started</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 shadow-sm"><p className="text-sm text-gray-500">Total Resumes</p><p className="text-2xl font-bold text-gray-900">{resumes.length}</p></div>
              <div className="bg-white rounded-xl p-5 shadow-sm"><p className="text-sm text-gray-500">Downloads Today</p><p className="text-2xl font-bold text-gray-900">0/2</p></div>
              <div className="bg-white rounded-xl p-5 shadow-sm"><p className="text-sm text-gray-500">Account</p><p className="text-2xl font-bold text-gray-900">Free</p></div>
              <div className="bg-white rounded-xl p-5 shadow-sm"><p className="text-sm text-gray-500">Profile</p><p className="text-lg font-bold text-gray-900 truncate">{user.name || user.email}</p></div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-3 gap-4">
                <Link href="/resume-builder" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1F4D3F] rounded-lg flex items-center justify-center"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></div>
                  <div><p className="font-medium text-gray-900">New Resume</p><p className="text-sm text-gray-500">Create from scratch</p></div>
                </Link>
                <Link href="/cover-letter" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#5B7C5B] rounded-lg flex items-center justify-center"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-5 7V3" /></svg></div>
                  <div><p className="font-medium text-gray-900">Cover Letter</p><p className="text-sm text-gray-500">Generate new letter</p></div>
                </Link>
                <Link href="/ai-tools" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#8B5CF6] rounded-lg flex items-center justify-center"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 3v4m-3-3h4m9-3v4m-3-3h4m2.5 9.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /></svg></div>
                  <div><p className="font-medium text-gray-900">AI Tools</p><p className="text-sm text-gray-500">Get suggestions</p></div>
                </Link>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Your Resumes</h2>
                <Link href="/resume-builder" className="text-[#1F4D3F] font-medium">+ New Resume</Link>
              </div>
              {resumes.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <p className="text-gray-600 mb-4">No resumes yet. Create your first one!</p>
                  <Link href="/resume-builder" className="inline-block px-4 py-2 bg-[#1F4D3F] text-white rounded-lg">Create Resume</Link>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {resumes.map((r) => (
                    <div key={r.id} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#1F4D3F]/10 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-[#1F4D3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{r.template}</p>
                          <p className="text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/resume-builder?id=${r.id}`} className="flex-1 text-center py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">Edit</Link>
                        <button onClick={() => deleteResume(r.id)} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}