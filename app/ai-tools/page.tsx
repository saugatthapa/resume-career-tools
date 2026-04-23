'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AITools() {
  const [activeTab, setActiveTab] = useState<'summary' | 'skills' | 'headline'>('summary');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const [form, setForm] = useState({
    role: '',
    experience: '',
    skills: '',
    jobTitle: '',
    industry: '',
    specialty: '',
  });

  const generateSummary = () => {
    setLoading(true);
    setTimeout(() => {
      const summaries = [
        `Results-driven ${form.role || 'professional'} with ${form.experience || '3+ years'} of experience driving measurable results. Proven expertise in strategic planning, team leadership, and delivering high-impact projects that exceed expectations.`,
        `Dynamic ${form.role || 'professional'} with a track record of success in ${form.industry || 'various industries'}. Skilled in problem-solving, stakeholder management, and driving innovation through data-driven decision making.`,
      ];
      setResult(summaries[Math.floor(Math.random() * summaries.length)]);
      setLoading(false);
    }, 1500);
  };

  const generateSkills = () => {
    setLoading(true);
    setTimeout(() => {
      const job = form.jobTitle.toLowerCase();
      let skills = 'Communication, Problem Solving, Teamwork, Time Management, Leadership';
      
      if (job.includes('dev') || job.includes('engineer')) {
        skills = 'JavaScript, TypeScript, React, Node.js, Python, SQL, Git, AWS, Docker, REST APIs';
      } else if (job.includes('design')) {
        skills = 'Figma, Adobe Creative Suite, UI/UX Design, Prototyping, User Research, Design Systems';
      } else if (job.includes('market')) {
        skills = 'SEO, Content Marketing, Social Media, Google Analytics, Email Marketing, PPC, Copywriting';
      } else if (job.includes('manage')) {
        skills = 'Project Management, Strategic Planning, Budget Management, Agile, Scrum, Team Leadership';
      }
      setResult(skills);
      setLoading(false);
    }, 1500);
  };

  const generateHeadline = () => {
    setLoading(true);
    setTimeout(() => {
      const headlines = [
        `${form.experience || 'Senior'} ${form.role || 'Professional'} | ${form.specialty || 'Results-Driven'}`,
        `${form.role || 'Professional'} with Proven Track Record | ${form.specialty || 'Expert'}`,
        `Strategic ${form.role || 'Leader'} | ${form.specialty || 'Problem Solver'}`,
      ];
      setResult(headlines[Math.floor(Math.random() * headlines.length)]);
      setLoading(false);
    }, 1500);
  };

  const handleGenerate = () => {
    if (activeTab === 'summary') generateSummary();
    else if (activeTab === 'skills') generateSkills();
    else generateHeadline();
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

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 3v4m-3-3h4m9-3v4m-3-3h4m2.5 9.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Resume Tools</h1>
          <p className="text-xl text-gray-600">Get AI-powered suggestions for your resume</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 bg-white p-2 rounded-xl border border-gray-200">
          {[
            { id: 'summary', label: 'Summary' },
            { id: 'skills', label: 'Skills' },
            { id: 'headline', label: 'Headline' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as typeof activeTab); setResult(''); }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#1F4D3F] text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 mb-8 border border-gray-200 shadow-sm">
          {activeTab === 'summary' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Role</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20"
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <input
                  type="text"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20"
                  placeholder="5+ years"
                />
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  value={form.jobTitle}
                  onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20"
                  placeholder="Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry (optional)</label>
                <input
                  type="text"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20"
                  placeholder="Technology"
                />
              </div>
            </div>
          )}

          {activeTab === 'headline' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Role</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20"
                  placeholder="Product Manager"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                <input
                  type="text"
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20"
                  placeholder="Growth & Analytics"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full mt-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? '✨ Generating...' : '✨ Generate'}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Result</h2>
            {activeTab === 'skills' ? (
              <div className="flex flex-wrap gap-2">
                {result.split(', ').map((skill, i) => (
                  <span key={i} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-lg text-gray-700 leading-relaxed">{result}</p>
            )}
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
            >
              Copy to clipboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}