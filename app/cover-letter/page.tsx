'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function CoverLetter() {
  const [form, setForm] = useState({
    yourName: '',
    jobTitle: '',
    companyName: '',
    skills: '',
  });
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      const generated = `Dear Hiring Manager,

I am writing to express my strong interest in the ${form.jobTitle || 'position'} at ${form.companyName || 'your company'}. With my background in ${form.skills || 'relevant skills'}, I am confident that I would be a valuable addition to your team.

Throughout my career, I have developed expertise in delivering results and driving success. I thrive in collaborative environments and am committed to continuous learning and professional growth. My strong communication and problem-solving skills have consistently enabled me to contribute meaningfully to organizational goals.

I am particularly excited about the opportunity to contribute to ${form.companyName || 'your company'} because ${form.yourName ? `${form.yourName} brings` : 'I bring'} a unique blend of skills and experience that align well with your organizational needs. I am eager to bring my passion and dedication to your team.

I would welcome the opportunity to discuss how my skills and experience align with your needs. Thank you for considering my application. I look forward to hearing from you.

Best regards,
${form.yourName || 'Your Name'}`;

      setLetter(generated);
      setLoading(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-5 7V3" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cover Letter Generator</h1>
          <p className="text-xl text-gray-600">Create a tailored cover letter in seconds</p>
        </div>

        <div className="bg-white rounded-2xl p-8 mb-8 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Tell us about the job</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                value={form.yourName}
                onChange={(e) => setForm({ ...form, yourName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                placeholder="Sarah Johnson"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
              <input
                type="text"
                value={form.jobTitle}
                onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                placeholder="Tech Corp"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Key Skills</label>
              <input
                type="text"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                placeholder="JavaScript, React, Node.js"
              />
            </div>
          </div>
          <button
            onClick={generate}
            disabled={loading}
            className="w-full mt-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              '✨ Generate Cover Letter'
            )}
          </button>
        </div>

        {letter && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Your Cover Letter</h2>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">{letter}</pre>
          </div>
        )}
      </main>
    </div>
  );
}