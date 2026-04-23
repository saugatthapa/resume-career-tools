'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { supabase } from '@/lib/supabase';

interface Experience {
  id: string;
  title: string;
  company: string;
  start: string;
  end: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export default function ResumeBuilder() {
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState('modern');
  const previewRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [contact, setContact] = useState({
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
  });

  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState<Experience[]>([
    { id: '1', title: '', company: '', start: '', end: '', description: '' },
  ]);
  const [education, setEducation] = useState<Education[]>([
    { id: '1', degree: '', school: '', year: '' },
  ]);

  const steps = [
    { num: 1, title: 'Contact', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { num: 2, title: 'Summary', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { num: 3, title: 'Skills', icon: 'M5 3v4M3 5h4M6 3v4m-3-3h4m9-3v4m-3-3h4m2.5 9.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z' },
    { num: 4, title: 'Experience', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { num: 5, title: 'Education', icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4.177 6h16.355m-16.355 0H7.823' },
  ];

  const updateContact = (field: string, value: string) => {
    setContact({ ...contact, [field]: value });
  };

  const addExperience = () => {
    setExperience([...experience, { id: Date.now().toString(), title: '', company: '', start: '', end: '', description: '' }]);
  };

  const removeExperience = (id: string) => {
    if (experience.length > 1) {
      setExperience(experience.filter(e => e.id !== id));
    }
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setExperience(experience.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const addEducation = () => {
    setEducation([...education, { id: Date.now().toString(), degree: '', school: '', year: '' }]);
  };

  const removeEducation = (id: string) => {
    if (education.length > 1) {
      setEducation(education.filter(e => e.id !== id));
    }
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setEducation(education.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const generateSummary = () => {
    const role = contact.jobTitle || 'professional';
    const summaries = [
      `Results-driven ${role} with proven expertise in delivering impactful solutions. Skilled in collaborating with cross-functional teams to drive innovation and achieve business objectives.`,
      `Dedicated ${role} passionate about continuous learning and professional growth. Committed to delivering excellence through strategic thinking and attention to detail.`,
      `Dynamic ${role} with a track record of success in fast-paced environments. Known for strong problem-solving abilities and effective communication skills.`,
    ];
    setSummary(summaries[Math.floor(Math.random() * summaries.length)]);
  };

  const generateSkills = () => {
    const job = contact.jobTitle.toLowerCase();
    let suggestedSkills = 'Communication, Problem Solving, Teamwork, Time Management, Leadership';
    
    if (job.includes('dev') || job.includes('engineer')) {
      suggestedSkills = 'JavaScript, TypeScript, React, Node.js, Python, SQL, Git, AWS, Docker';
    } else if (job.includes('design')) {
      suggestedSkills = 'Figma, Adobe Creative Suite, UI/UX, Prototyping, User Research, Design Systems';
    } else if (job.includes('market')) {
      suggestedSkills = 'SEO, Content Marketing, Social Media, Google Analytics, Email Marketing, PPC';
    } else if (job.includes('manage')) {
      suggestedSkills = 'Project Management, Strategic Planning, Budget Management, Team Leadership, Agile, Scrum';
    }
    setSkills(suggestedSkills);
  };

  const downloadPDF = async () => {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${contact.fullName || 'resume'}.pdf`);
    } catch (err) {
      alert('Error generating PDF');
    }
    setDownloading(false);
  };

  const saveResume = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('Please sign in to save your resume');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          template,
          data: { contact, summary, skills, experience, education },
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      alert('Error saving resume');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1F4D3F] to-[#2D6B56] rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-900">ResumeCraft</span>
            </Link>
            <div className="flex items-center gap-3">
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20"
              >
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
                <option value="creative">Creative</option>
              </select>
              <button
                onClick={saveResume}
                disabled={saving}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save'}
              </button>
              <button
                onClick={downloadPDF}
                disabled={downloading}
                className="px-5 py-2 bg-[#1F4D3F] text-white rounded-xl text-sm font-medium hover:bg-[#1a4535] transition disabled:opacity-50 shadow-lg"
              >
                {downloading ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <button
                  onClick={() => setStep(s.num)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    step === s.num
                      ? 'bg-[#1F4D3F] text-white'
                      : step > s.num
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === s.num ? 'bg-white/20' : step > s.num ? 'bg-green-500 text-white' : 'bg-gray-200'
                  }`}>
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span className="font-medium hidden md:block">{s.title}</span>
                </button>
                {i < steps.length - 1 && (
                  <div className={`w-12 md:w-20 h-1 mx-2 rounded ${step > s.num ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={contact.fullName}
                        onChange={(e) => updateContact('fullName', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20 focus:border-[#1F4D3F]"
                        placeholder="Sarah Johnson"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                      <input
                        type="text"
                        value={contact.jobTitle}
                        onChange={(e) => updateContact('jobTitle', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20 focus:border-[#1F4D3F]"
                        placeholder="Software Engineer"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => updateContact('email', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20 focus:border-[#1F4D3F]"
                        placeholder="sarah@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => updateContact('phone', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20 focus:border-[#1F4D3F]"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={contact.location}
                      onChange={(e) => updateContact('location', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20 focus:border-[#1F4D3F]"
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn (optional)</label>
                    <input
                      type="text"
                      value={contact.linkedin}
                      onChange={(e) => updateContact('linkedin', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20 focus:border-[#1F4D3F]"
                      placeholder="linkedin.com/in/sarahjohnson"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Summary</h2>
                <p className="text-gray-600 mb-5">Write a brief overview of your professional background and goals.</p>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20 focus:border-[#1F4D3F] resize-none"
                  placeholder="A compelling summary of your skills and experience..."
                />
                <button
                  onClick={generateSummary}
                  className="mt-4 px-5 py-2.5 bg-[#1F4D3F]/10 text-[#1F4D3F] rounded-xl text-sm font-medium hover:bg-[#1F4D3F]/20 transition"
                >
                  ✨ Generate with AI
                </button>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
                <p className="text-gray-600 mb-5">List your key skills and competencies.</p>
                <textarea
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20 focus:border-[#1F4D3F] resize-none"
                  placeholder="JavaScript, React, Node.js, Python..."
                />
                <button
                  onClick={generateSkills}
                  className="mt-4 px-5 py-2.5 bg-[#1F4D3F]/10 text-[#1F4D3F] rounded-xl text-sm font-medium hover:bg-[#1F4D3F]/20 transition"
                >
                  ✨ Get Skill Suggestions
                </button>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Work Experience</h2>
                <p className="text-gray-600 mb-5">List your relevant work experience.</p>
                <div className="space-y-6">
                  {experience.map((exp) => (
                    <div key={exp.id} className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-medium text-gray-500">Position {experience.indexOf(exp) + 1}</span>
                        {experience.length > 1 && (
                          <button
                            onClick={() => removeExperience(exp.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                          className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20"
                          placeholder="Job Title"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20"
                          placeholder="Company"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          value={exp.start}
                          onChange={(e) => updateExperience(exp.id, 'start', e.target.value)}
                          className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20"
                          placeholder="Start Date (Jan 2020)"
                        />
                        <input
                          type="text"
                          value={exp.end}
                          onChange={(e) => updateExperience(exp.id, 'end', e.target.value)}
                          className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20"
                          placeholder="End Date (Dec 2023)"
                        />
                      </div>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20 resize-none"
                        placeholder="Describe your key responsibilities and achievements..."
                      />
                    </div>
                  ))}
                  <button
                    onClick={addExperience}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-[#1F4D3F] hover:text-[#1F4D3F] transition"
                  >
                    + Add Another Position
                  </button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
                <p className="text-gray-600 mb-5">Add your educational background.</p>
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div key={edu.id} className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-medium text-gray-500">Education {education.indexOf(edu) + 1}</span>
                        {education.length > 1 && (
                          <button
                            onClick={() => removeEducation(edu.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20"
                          placeholder="Bachelor's in Computer Science"
                        />
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                          className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20"
                          placeholder="Stanford University"
                        />
                      </div>
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20"
                        placeholder="Graduation Year (2020)"
                      />
                    </div>
                  ))}
                  <button
                    onClick={addEducation}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-[#1F4D3F] hover:text-[#1F4D3F] transition"
                  >
                    + Add Another Education
                  </button>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <button
                onClick={() => setStep(Math.min(5, step + 1))}
                disabled={step === 5}
                className="px-6 py-3 bg-[#1F4D3F] text-white rounded-xl font-medium hover:bg-[#1a4535] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 5 ? 'Finish' : 'Next →'}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Live Preview</h3>
              <span className="text-sm text-gray-500 capitalize">{template} Template</span>
            </div>
            <div
              ref={previewRef}
              className="bg-white rounded-xl shadow-lg p-8 aspect-[8.5/11] overflow-hidden"
              style={{
                background: template === 'classic' ? '#fff' : template === 'creative' ? '#faf5ff' : '#fff',
              }}
            >
              <div className="space-y-4">
                {contact.fullName && (
                  <div className="text-center border-b-2 pb-3" style={{ borderColor: '#1F4D3F' }}>
                    <h1 className="text-2xl font-bold text-gray-900">{contact.fullName}</h1>
                    {contact.jobTitle && <p className="text-gray-600 mt-1">{contact.jobTitle}</p>}
                    <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs text-gray-500">
                      {contact.email && <span>{contact.email}</span>}
                      {contact.phone && <span>• {contact.phone}</span>}
                      {contact.location && <span>• {contact.location}</span>}
                    </div>
                  </div>
                )}
                
                {summary && (
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2" style={{ color: '#1F4D3F' }}>Summary</h2>
                    <p className="text-xs text-gray-600">{summary}</p>
                  </div>
                )}
                
                {skills && (
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2" style={{ color: '#1F4D3F' }}>Skills</h2>
                    <div className="flex flex-wrap gap-1">
                      {skills.split(',').map((skill, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-700">{skill.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {experience.some(e => e.title) && (
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2" style={{ color: '#1F4D3F' }}>Experience</h2>
                    {experience.filter(e => e.title).map((exp) => (
                      <div key={exp.id} className="mb-3">
                        <div className="flex justify-between">
                          <p className="text-sm font-semibold text-gray-900">{exp.title}</p>
                          <p className="text-xs text-gray-500">{exp.start} - {exp.end || 'Present'}</p>
                        </div>
                        <p className="text-xs text-gray-600">{exp.company}</p>
                        {exp.description && <p className="text-xs text-gray-600 mt-1">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
                
                {education.some(e => e.degree) && (
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2" style={{ color: '#1F4D3F' }}>Education</h2>
                    {education.filter(e => e.degree).map((edu) => (
                      <div key={edu.id} className="mb-2">
                        <p className="text-sm font-semibold text-gray-900">{edu.degree}</p>
                        <p className="text-xs text-gray-600">{edu.school} {edu.year && `• ${edu.year}`}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}