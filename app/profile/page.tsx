'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button, Input, Toast } from '@/components/ui';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; show: boolean }>({ message: '', type: 'success', show: false });
  
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/dashboard');
      return;
    }
    setUser(session.user);
    setForm(prev => ({
      ...prev,
      email: session.user.email || '',
      full_name: session.user.user_metadata?.full_name || '',
    }));
    setLoading(false);
  };

  const handleNameUpdate = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({ full_name: form.full_name }),
      });

      if (res.ok) {
        await supabase.auth.updateUser({ data: { full_name: form.full_name } });
        setToast({ message: 'Name updated successfully', type: 'success', show: true });
      } else {
        setToast({ message: 'Failed to update name', type: 'error', show: true });
      }
    } catch (err) {
      setToast({ message: 'An error occurred', type: 'error', show: true });
    }
    setSaving(false);
  };

  const handlePasswordUpdate = async () => {
    if (form.new_password !== form.confirm_password) {
      setToast({ message: 'Passwords do not match', type: 'error', show: true });
      return;
    }
    if (form.new_password.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error', show: true });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: form.new_password });
      if (error) {
        setToast({ message: error.message, type: 'error', show: true });
      } else {
        setForm(prev => ({ ...prev, current_password: '', new_password: '', confirm_password: '' }));
        setToast({ message: 'Password updated successfully', type: 'success', show: true });
      }
    } catch (err) {
      setToast({ message: 'An error occurred', type: 'error', show: true });
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1F4D3F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
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
              <Link href="/my-resumes" className="text-sm text-gray-600 hover:text-gray-900">My Resumes</Link>
              <button onClick={handleSignOut} className="text-sm text-red-500 hover:text-red-700">Sign Out</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

        <div className="space-y-8">
          {/* Profile Section */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
            
            <div className="space-y-4">
              <Input
                label="Full Name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Your full name"
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <Button onClick={handleNameUpdate} loading={saving} className="mt-6">
              Update Name
            </Button>
          </div>

          {/* Password Section */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
            
            <div className="space-y-4">
              <Input
                label="New Password"
                type="password"
                value={form.new_password}
                onChange={(e) => setForm({ ...form, new_password: e.target.value })}
                placeholder="Enter new password"
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={form.confirm_password}
                onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>

            <Button onClick={handlePasswordUpdate} loading={saving} className="mt-6" disabled={!form.new_password}>
              Update Password
            </Button>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl p-8 border border-red-200">
            <h2 className="text-xl font-semibold text-red-600 mb-6">Danger Zone</h2>
            <p className="text-gray-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="danger">
              Delete Account
            </Button>
          </div>
        </div>
      </main>

      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
}