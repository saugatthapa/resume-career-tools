'use client';

import Link from 'next/link';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1F4D3F] to-[#2D6B56] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900">ResumeCraft</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Start free, upgrade when you need more</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
            <div className="mb-8">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Free</span>
              <div className="flex items-baseline mt-3">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500 ml-2">forever</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                '3 professional templates',
                '2 downloads per day',
                'Basic AI suggestions',
                'PDF export with watermark',
                'Email support',
              ].map((item, i) => (
                <li key={i} className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/dashboard"
              className="block w-full py-4 text-center border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-[#1F4D3F] to-[#2D6B56] rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur">
              Best Value
            </div>

            <div className="mb-8">
              <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">Pro</span>
              <div className="flex items-baseline mt-3">
                <span className="text-5xl font-bold">$5</span>
                <span className="text-white/70 ml-2">/month</span>
              </div>
              <p className="text-white/60 mt-2">Cancel anytime</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'All 10+ templates',
                'Unlimited downloads',
                'Advanced AI tools',
                'No watermark',
                'Priority support',
                'Cover letter generator',
                'Multiple resume versions',
              ].map((item, i) => (
                <li key={i} className="flex items-center">
                  <svg className="w-5 h-5 text-white mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/dashboard"
              className="block w-full py-4 text-center bg-white text-[#1F4D3F] rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your Pro subscription at any time. Your access will continue until the end of your billing period.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit cards through PayPal.' },
              { q: 'Is there a free trial for Pro?', a: 'We offer a 7-day money-back guarantee on Pro. If you are not satisfied, contact us for a full refund.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}