'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#1F4D3F] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-900">ResumeTools</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-[#1F4D3F]">Features</Link>
              <Link href="#tools" className="text-gray-600 hover:text-[#1F4D3F]">Tools</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-[#1F4D3F]">Pricing</Link>
              <Link href="/dashboard" className="px-5 py-2.5 bg-[#1F4D3F] text-white rounded-lg font-medium hover:bg-opacity-90">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#1F4D3F] text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-6">
            Trusted by 50,000+ Job Seekers
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Build Resumes That<br/>Get You Hired
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Create professional resumes and cover letters in minutes. AI-powered tools to help you stand out and land your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="px-8 py-4 bg-white text-[#1F4D3F] rounded-xl font-semibold text-lg hover:bg-gray-100 transition">
              Start Free
            </Link>
            <Link href="#features" className="px-8 py-4 bg-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/30 transition">
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Powerful tools to create professional resumes and cover letters that get noticed.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#F8F9FA] p-8 rounded-2xl">
              <div className="w-14 h-14 bg-[#1F4D3F] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Resume Builder</h3>
              <p className="text-gray-600">Step-by-step wizard to create professional resumes. Choose from 3 templates, edit sections, and preview live.</p>
            </div>
            <div className="bg-[#F8F9FA] p-8 rounded-2xl">
              <div className="w-14 h-14 bg-[#5B7C5B] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-5 7V3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cover Letter Generator</h3>
              <p className="text-gray-600">Instantly generate professional cover letters tailored to any job posting.</p>
            </div>
            <div className="bg-[#F8F9FA] p-8 rounded-2xl">
              <div className="w-14 h-14 bg-[#8B5CF6] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 3v4m-3-3h4m9-3v4m-3-3h4m2.5 9.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Tools</h3>
              <p className="text-gray-600">AI-powered resume summaries, skill suggestions, and headline generation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="py-20 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Free Online Tools</h2>
            <p className="text-gray-600">Try our specialized tools - no signup required.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <Link href="/ai-tools" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Resume Summary</h3>
              <p className="text-sm text-gray-500">Generate summaries</p>
            </Link>
            <Link href="/cover-letter" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-5 7V3" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Cover Letter</h3>
              <p className="text-sm text-gray-500">Create letters fast</p>
            </Link>
            <Link href="/ai-tools" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Resume Headline</h3>
              <p className="text-sm text-gray-500">Catchy headlines</p>
            </Link>
            <Link href="/ai-tools" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Skills Generator</h3>
              <p className="text-sm text-gray-500">Find best skills</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-[#1F4D3F] text-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-white/80">Start free, upgrade when you need more.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 rounded-2xl p-8 border border-white/20">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">Free</span>
              <h3 className="text-2xl font-bold mb-2">Basic</h3>
              <p className="text-4xl font-bold mb-1">$0</p>
              <p className="text-white/80 mb-6">Forever free</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="mr-3">✓</span> Basic template</li>
                <li className="flex items-center"><span className="mr-3">✓</span> 2 downloads/day</li>
                <li className="flex items-center"><span className="mr-3">✓</span> PDF watermark</li>
              </ul>
              <Link href="/dashboard" className="block w-full py-3 bg-white/20 rounded-lg text-center font-medium hover:bg-white/30 transition">
                Get Started Free
              </Link>
            </div>
            <div className="bg-white rounded-2xl p-8 text-gray-900">
              <span className="inline-block px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-medium mb-4">Most Popular</span>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-4xl font-bold mb-1">$5<span className="text-lg font-normal">/month</span></p>
              <p className="text-gray-500 mb-6">Cancel anytime</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="mr-3">✓</span> All 3 templates</li>
                <li className="flex items-center"><span className="mr-3">✓</span> Unlimited downloads</li>
                <li className="flex items-center"><span className="mr-3">✓</span> No watermark</li>
              </ul>
              <Link href="/pricing" className="block w-full py-3 bg-[#1F4D3F] text-white rounded-lg text-center font-medium hover:bg-opacity-90 transition">
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#1F4D3F]/90">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div><p className="text-4xl font-bold">50K+</p><p className="text-white/80">Resumes Created</p></div>
            <div><p className="text-4xl font-bold">25K+</p><p className="text-white/80">Jobs Landing</p></div>
            <div><p className="text-4xl font-bold">98%</p><p className="text-white/80">Success Rate</p></div>
            <div><p className="text-4xl font-bold">4.9/5</p><p className="text-white/80">User Rating</p></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Build Your Resume?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands who landed their dream jobs.</p>
          <Link href="/dashboard" className="inline-flex px-8 py-4 bg-[#1F4D3F] text-white rounded-xl font-semibold text-lg hover:bg-opacity-90">
            Start Building Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F4D3F] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-semibold">ResumeTools</span>
            </div>
            <p className="text-white/60 text-sm">&copy; 2024 ResumeTools</p>
          </div>
        </div>
      </footer>
    </div>
  );
}