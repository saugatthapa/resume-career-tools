'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button, Badge, Toast } from '@/components/ui';

function BillingPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('inactive');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; show: boolean }>({ message: '', type: 'success', show: false });

  useEffect(() => {
    checkAuth();
    
    // Handle PayPal redirect
    if (searchParams.get('success') === 'true') {
      setToast({ message: 'Subscription activated! Welcome to Pro.', type: 'success', show: true });
    }
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/dashboard');
      return;
    }
    setUser(session.user);
    
    // Fetch user profile for subscription status
    try {
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setIsPremium(data.isPremium);
        setSubscriptionStatus(data.subscriptionStatus);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
    setLoading(false);
  };

  const handleUpgrade = async () => {
    if (!user) return;
    setProcessing(true);

    try {
      const res = await fetch('/api/paypal/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });

      const data = await res.json();
      
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else {
        setToast({ message: data.message || 'Failed to create subscription', type: 'error', show: true });
        setProcessing(false);
      }
    } catch (err) {
      setToast({ message: 'An error occurred', type: 'error', show: true });
      setProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    
    setProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // First update locally
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ action: 'cancel' }),
      });

      setIsPremium(false);
      setSubscriptionStatus('cancelled');
      setToast({ message: 'Subscription cancelled', type: 'success', show: true });
    } catch (err) {
      setToast({ message: 'Failed to cancel subscription', type: 'error', show: true });
    }
    setProcessing(false);
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
              <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900">Profile</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing</h1>
        <p className="text-gray-600 mb-10">Manage your subscription and billing</p>

        {/* Current Plan */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
              <p className="text-gray-500 mt-1">Your subscription details</p>
            </div>
            {isPremium ? (
              <Badge variant="premium">Pro Member</Badge>
            ) : (
              <Badge>Free</Badge>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Plan</p>
              <p className="font-semibold text-gray-900">{isPremium ? 'Pro - $5/month' : 'Free'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <p className="font-semibold text-gray-900 capitalize">{subscriptionStatus}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Downloads</p>
              <p className="font-semibold text-gray-900">{isPremium ? 'Unlimited' : '2/day'}</p>
            </div>
          </div>

          {!isPremium ? (
            <div className="bg-gradient-to-r from-[#1F4D3F] to-[#2D6B56] rounded-xl p-6 text-white">
              <h3 className="font-semibold text-lg mb-2">Upgrade to Pro</h3>
              <p className="text-white/80 mb-4">Get unlimited downloads, all templates, and priority support</p>
              <Button 
                onClick={handleUpgrade} 
                loading={processing}
                className="bg-white text-[#1F4D3F] hover:bg-gray-100"
              >
                Upgrade Now - $5/month
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div>
                <p className="font-semibold text-green-700">You're a Pro member!</p>
                <p className="text-sm text-green-600">Thank you for your support</p>
              </div>
              <Button variant="outline" onClick={handleCancelSubscription} loading={processing}>
                Cancel Subscription
              </Button>
            </div>
          )}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Features</h2>
          <div className="space-y-4">
            {[
              { feature: 'Resume templates', free: '3 templates', pro: 'All 10+ templates' },
              { feature: 'Daily downloads', free: '2 per day', pro: 'Unlimited' },
              { feature: 'PDF watermark', free: 'Yes', pro: 'No' },
              { feature: 'Cover letter generator', free: 'Limited', pro: 'Unlimited' },
              { feature: 'AI tools', free: 'Basic', pro: 'Priority access' },
              { feature: 'Support', free: 'Email', pro: 'Priority support' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <span className="text-gray-700">{item.feature}</span>
                <div className="flex items-center gap-8">
                  <span className="text-gray-500 text-sm">{item.free}</span>
                  <span className="text-[#1F4D3F] font-medium text-sm">{item.pro}</span>
                </div>
              </div>
            ))}
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

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F4D3F]"></div></div>}>
      <BillingPageInner />
    </Suspense>
  );
}