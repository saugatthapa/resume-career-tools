'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Pricing() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const upgradeToPro = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      router.push('/dashboard');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/user/profile/upgrade`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.isPremium = true;
        localStorage.setItem('user', JSON.stringify(user));
        alert('Successfully upgraded to Pro!');
        router.push('/dashboard');
      }
    } catch {
      alert('Error upgrading');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-900">ResumeTools</span>
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-sm font-medium mb-3">
            Pro Plan
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Upgrade to Pro</h1>
          <p className="text-xl text-gray-600">Get unlimited access to all features</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Free</h2>
            <p className="text-4xl font-bold mb-6">$0<span className="text-lg font-normal text-gray-500">/month</span></p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Basic template
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                2 downloads/day
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                PDF watermark
              </li>
            </ul>
            <div className="px-6 py-3 bg-gray-100 rounded-lg text-center text-gray-500">Current Plan</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Pro</h2>
            <p className="text-4xl font-bold mb-6">$5<span className="text-lg font-normal text-white/80">/month</span></p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                All 3 templates
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited downloads
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No watermark
              </li>
            </ul>
            <button
              onClick={upgradeToPro}
              disabled={loading}
              className="w-full py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Upgrade Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}