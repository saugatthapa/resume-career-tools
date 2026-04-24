'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_premium: boolean;
  subscription_status: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await fetchProfile(session.user.id);
    }
    setLoading(false);
  };

  const fetchProfile = async (userId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    const profile: UserProfile = {
      id: userId,
      email: authUser?.email || '',
      full_name: authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || null,
      avatar_url: null,
      is_premium: authUser?.user_metadata?.is_premium || false,
      subscription_status: authUser?.user_metadata?.subscription_status || 'inactive',
    };

    setUser(profile);

    // Also check subscription table for real premium status
    if (session?.access_token) {
      try {
        const res = await fetch('/api/user/profile', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(prev => prev ? { ...prev, is_premium: data.isPremium } : null);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { error: 'Not authenticated' };

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const data = await res.json();
        return { error: data.message || 'Failed to update profile' };
      }

      setUser(prev => prev ? { ...prev, ...data } : null);
      return { error: null };
    } catch (err) {
      return { error: 'Failed to update profile' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}