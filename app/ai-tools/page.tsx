'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AITools() {
  const [activeTab, setActiveTab] = useState<'summary' | 'skills' | 'headline'>('summary');
  const [summaryResult, setSummaryResult] = useState('');
  const [skillsResult, setSkillsResult] = useState<string[]>([]);
  const [headlineResult, setHeadlineResult] = useState('');
  const [form, setForm] = useState({ role: '', experience: '', skills: '', jobTitle: '', industry: '', specialty: '' });

  const generateSummary = async () => {
    if (!form.role) return alert('Enter your role');
    try {
      const res = await fetch(`${API_URL}/api/ai/summarize`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) setSummaryResult(data.summary);
    } catch { alert('Error generating summary'); }
  };

  const generateSkills = async () => {
    if (!form.jobTitle) return alert('Enter job title');
    try {
      const res = await fetch(`${API_URL}/api/ai/skills`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle: form.jobTitle }),
      });
      const data = await res.json();
      if (res.ok) setSkillsResult(data.skills);
    } catch { alert('Error generating skills'); }
  };

  const generateHeadline = async () => {
    if (!form.role) return alert('Enter your role');
    try {
      const res = await fetch(`${API_URL}/api/ai/headline`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) setHeadlineResult(data.headline);
    } catch { alert('Error generating headline'); }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#1F4D3F] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <span className="font-semibold text-gray-900">ResumeTools</span>
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">AI Resume Tools</h1>
        <div className="flex justify-center gap-2 mb-8">
          {(['summary', 'skills', 'headline'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-lg ${activeTab === tab ? 'bg-[#1F4D3F] text-white' : 'bg-white text-gray-700'}`}>
              {tab === 'summary' ? 'Summary' : tab === 'skills' ? ' Skills' : 'Headline'}
            </button>
          ))}
        </div>

        {activeTab === 'summary' && (
          <div className="bg-white rounded-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Generate Resume Summary</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="px-4 py-3 bg-gray-50 rounded-lg" placeholder="Your Role" />
              <input type="text" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className="px-4 py-3 bg-gray-50 rounded-lg" placeholder="Experience" />
              <input type="text" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} className="px-4 py-3 bg-gray-50 rounded-lg" placeholder="Skills" />
            </div>
            <button onClick={generateSummary} className="px-6 py-3 bg-[#1F4D3F] text-white rounded-lg">Generate Summary</button>
            {summaryResult && <div className="mt-6 p-4 bg-green-50 rounded-lg"><p className="text-gray-800">{summaryResult}</p></div>}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="bg-white rounded-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Get Skill Suggestions</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <input type="text" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} className="px-4 py-3 bg-gray-50 rounded-lg" placeholder="Job Title" />
              <input type="text" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="px-4 py-3 bg-gray-50 rounded-lg" placeholder="Industry" />
            </div>
            <button onClick={generateSkills} className="px-6 py-3 bg-[#1F4D3F] text-white rounded-lg">Get Suggestions</button>
            {skillsResult.length > 0 && <div className="mt-6 flex flex-wrap gap-2">{skillsResult.map((skill, i) => <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{skill}</span>)}</div>}
          </div>
        )}

        {activeTab === 'headline' && (
          <div className="bg-white rounded-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Generate Resume Headline</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="px-4 py-3 bg-gray-50 rounded-lg" placeholder="Your Role" />
              <input type="text" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className="px-4 py-3 bg-gray-50 rounded-lg" placeholder="Experience" />
              <input type="text" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className="px-4 py-3 bg-gray-50 rounded-lg" placeholder="Specialty" />
            </div>
            <button onClick={generateHeadline} className="px-6 py-3 bg-[#1F4D3F] text-white rounded-lg">Generate Headline</button>
            {headlineResult && <div className="mt-6 p-4 bg-green-50 rounded-lg"><p className="text-xl font-bold text-gray-900">{headlineResult}</p></div>}
          </div>
        )}
      </div>
    </div>
  );
}