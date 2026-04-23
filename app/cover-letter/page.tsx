'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function CoverLetter() {
  const [form, setForm] = useState({ yourName: '', jobTitle: '', companyName: '', skills: '' });
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!form.jobTitle || !form.companyName) {
      alert('Please enter job title and company name');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/ai/cover-letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setLetter(data.letter);
      }
    } catch {
      alert('Error generating cover letter');
    }
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(letter);
    alert('Copied!');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#1F4D3F] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">ResumeTools</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            <Link href="/pricing" className="px-4 py-2 bg-[#1F4D3F] text-white rounded-lg hover:bg-opacity-90">Upgrade</Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cover Letter Generator</h1>
          <p className="text-xl text-gray-600">Generate professional cover letters in seconds!</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Enter Job Details</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input type="text" value={form.yourName} onChange={(e) => setForm({ ...form, yourName: e.target.value })} className="w-full px-4 py-3 bg-gray-50 rounded-lg" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
              <input type="text" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} className="w-full px-4 py-3 bg-gray-50 rounded-lg" placeholder="Software Engineer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input type="text" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="w-full px-4 py-3 bg-gray-50 rounded-lg" placeholder="Tech Company" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Key Skills</label>
              <input type="text" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} className="w-full px-4 py-3 bg-gray-50 rounded-lg" placeholder="JavaScript, React..." />
            </div>
          </div>
          <button onClick={generate} disabled={loading} className="w-full py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50">
            {loading ? 'Generating...' : 'Generate Cover Letter'}
          </button>
        </div>

        {letter && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Cover Letter</h2>
              <button onClick={copy} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Copy</button>
            </div>
            <pre className="whitespace-pre-wrap bg-gray-50 p-6 rounded-lg text-gray-700 font-sans">{letter}</pre>
          </div>
        )}
      </div>
    </div>
  );
}