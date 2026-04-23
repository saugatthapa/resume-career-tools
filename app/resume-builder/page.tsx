'use client';

import { useState, Suspense, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ResumeData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  skills: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function ResumeBuilderContent() {
  const searchParams = useSearchParams();
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState('modern');
  const [data, setData] = useState<ResumeData>({
    fullName: '', jobTitle: '', email: '', phone: '', location: '', linkedin: '', summary: '', skills: '',
  });
  const [experience, setExperience] = useState([{ title: '', company: '', start: '', end: '', description: '' }]);
  const [education, setEducation] = useState([{ degree: '', school: '', year: '', gpa: '' }]);
  const [downloading, setDownloading] = useState(false);

  const updateField = (field: keyof ResumeData, value: string) => setData({ ...data, [field]: value });
  const updateExperience = (i: number, f: string, v: string) => { const u = [...experience]; u[i] = { ...u[i], [f]: v }; setExperience(u); };
  const updateEducation = (i: number, f: string, v: string) => { const u = [...education]; u[i] = { ...u[i], [f]: v }; setEducation(u); };

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
      pdf.save(`${data.fullName || 'resume'}.pdf`);
    } catch (err) {
      alert('Error generating PDF');
    }
    setDownloading(false);
  };

  const generateAISummary = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login first');
    try {
      const res = await fetch(`${API_URL}/api/ai/summarize`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: data.jobTitle, skills: data.skills }),
      });
      const result = await res.json();
      if (res.ok) setData({ ...data, summary: result.summary });
    } catch { alert('Error generating summary'); }
  };

  const generateAISkills = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login first');
    try {
      const res = await fetch(`${API_URL}/api/ai/skills`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle: data.jobTitle }),
      });
      const result = await res.json();
      if (res.ok) setData({ ...data, skills: result.skills.join(', ') });
    } catch { alert('Error generating skills'); }
  };

  const saveResume = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login first');
    try {
      await fetch(`${API_URL}/api/resume`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ template, data: { ...data, experience, education } }),
      });
      alert('Resume saved!');
    } catch { alert('Error saving resume'); }
  };

  const steps = ['Contact', 'Summary', 'Skills', 'Experience', 'Education'];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#1F4D3F] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <span className="font-semibold text-gray-900">ResumeTools</span>
          </Link>
          <div className="flex items-center gap-3">
            <select value={template} onChange={(e) => setTemplate(e.target.value)} className="px-3 py-2 bg-gray-100 rounded-lg text-sm">
              <option value="modern">Modern</option><option value="classic">Classic</option><option value="creative">Creative</option>
            </select>
            <button onClick={saveResume} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">Save</button>
            <button onClick={downloadPDF} disabled={downloading} className="px-4 py-2 bg-[#1F4D3F] text-white rounded-lg text-sm font-medium disabled:opacity-50">
              {downloading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </nav>

      <div className="flex max-w-7xl mx-auto">
        <div className="w-1/2 p-6">
          <div className="flex gap-2 mb-6">
            {steps.map((n, i) => <button key={i} onClick={() => setStep(i + 1)} className={`px-4 py-2 rounded-lg text-sm font-medium ${step === i + 1 ? 'bg-[#1F4D3F] text-white' : 'bg-gray-100 text-gray-600'}`}>{i + 1}. {n}</button>)}
          </div>

          {step === 1 && <div className="bg-white rounded-xl p-6 shadow-sm"><h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Info</h2><div className="grid grid-cols-2 gap-4">
            <input type="text" value={data.fullName} onChange={(e) => updateField('fullName', e.target.value)} className="px-4 py-3 bg-gray-50 rounded-lg" placeholder="Full Name" />
            <input type="text" value={data.jobTitle} onChange={(e) => updateField('jobTitle', e.target.value)} className="px-4 py-3 bg-gray-50 rounded-lg" placeholder="Job Title" />
            <input type="email" value={data.email} onChange={(e) => updateField('email', e.target.value)} className="px-4 py-3 bg-gray-50 rounded-lg" placeholder="Email" />
            <input type="tel" value={data.phone} onChange={(e) => updateField('phone', e.target.value)} className="px-4 py-3 bg-gray-50 rounded-lg" placeholder="Phone" />
            <input type="text" value={data.location} onChange={(e) => updateField('location', e.target.value)} className="px-4 py-3 bg-gray-50 rounded-lg" placeholder="Location" />
            <input type="text" value={data.linkedin} onChange={(e) => updateField('linkedin', e.target.value)} className="px-4 py-3 bg-gray-50 rounded-lg" placeholder="LinkedIn URL" />
          </div></div>}

          {step === 2 && <div className="bg-white rounded-xl p-6 shadow-sm"><h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h2>
            <textarea value={data.summary} onChange={(e) => updateField('summary', e.target.value)} rows={6} className="w-full px-4 py-3 bg-gray-50 rounded-lg" placeholder="Write a brief summary..." />
            <button onClick={generateAISummary} className="mt-3 text-[#1F4D3F] text-sm font-medium">+ Generate with AI</button></div>}

          {step === 3 && <div className="bg-white rounded-xl p-6 shadow-sm"><h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
            <textarea value={data.skills} onChange={(e) => updateField('skills', e.target.value)} rows={4} className="w-full px-4 py-3 bg-gray-50 rounded-lg" placeholder="JavaScript, React, Node.js..." />
            <button onClick={generateAISkills} className="mt-3 text-[#1F4D3F] text-sm font-medium">+ Get suggestions</button></div>}

          {step === 4 && <div className="bg-white rounded-xl p-6 shadow-sm"><h2 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h2>
            {experience.map((exp, i) => <div key={i} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-3 mb-3"><input type="text" value={exp.title} onChange={(e) => updateExperience(i, 'title', e.target.value)} className="px-3 py-2 rounded-lg" placeholder="Job Title" /><input type="text" value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} className="px-3 py-2 rounded-lg" placeholder="Company" /></div>
              <div className="grid grid-cols-2 gap-3 mb-3"><input type="text" value={exp.start} onChange={(e) => updateExperience(i, 'start', e.target.value)} className="px-3 py-2 rounded-lg" placeholder="Start Date" /><input type="text" value={exp.end} onChange={(e) => updateExperience(i, 'end', e.target.value)} className="px-3 py-2 rounded-lg" placeholder="End Date" /></div>
              <textarea value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg" placeholder="Description" /></div>)}
            <button onClick={() => setExperience([...experience, { title: '', company: '', start: '', end: '', description: '' }])} className="text-[#1F4D3F] text-sm font-medium">+ Add Experience</button></div>}

          {step === 5 && <div className="bg-white rounded-xl p-6 shadow-sm"><h2 className="text-lg font-semibold text-gray-900 mb-4">Education</h2>
            {education.map((edu, i) => <div key={i} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-3 mb-3"><input type="text" value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} className="px-3 py-2 rounded-lg" placeholder="Degree" /><input type="text" value={edu.school} onChange={(e) => updateEducation(i, 'school', e.target.value)} className="px-3 py-2 rounded-lg" placeholder="School" /></div>
              <div className="grid grid-cols-2 gap-3"><input type="text" value={edu.year} onChange={(e) => updateEducation(i, 'year', e.target.value)} className="px-3 py-2 rounded-lg" placeholder="Year" /><input type="text" value={edu.gpa} onChange={(e) => updateEducation(i, 'gpa', e.target.value)} className="px-3 py-2 rounded-lg" placeholder="GPA" /></div></div>)}
            <button onClick={() => setEducation([...education, { degree: '', school: '', year: '', gpa: '' }])} className="text-[#1F4D3F] text-sm font-medium">+ Add Education</button></div>}

          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(Math.max(1, step - 1))} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium">Previous</button>
            <button onClick={() => setStep(Math.min(5, step + 1))} className="px-6 py-3 bg-[#1F4D3F] text-white rounded-lg font-medium">Next</button>
          </div>
        </div>

        <div className="w-1/2 p-6 bg-gray-100">
          <h3 className="text-sm font-medium text-gray-600 mb-4">Live Preview</h3>
          <div ref={previewRef} className="bg-white rounded-xl shadow-lg p-8 aspect-[8.5/11] overflow-hidden">
            <div className="text-center mb-4"><h1 className="text-xl font-bold text-gray-900">{data.fullName || 'Your Name'}</h1><p className="text-sm text-gray-600">{data.jobTitle || 'Job Title'}</p><p className="text-xs text-gray-500 mt-1">{data.email} • {data.phone} • {data.location}</p></div>
            {data.summary && <div className="border-t pt-3 mb-3"><h2 className="text-sm font-semibold text-gray-900 mb-1">Summary</h2><p className="text-xs text-gray-600">{data.summary}</p></div>}
            {data.skills && <div className="border-t pt-3 mb-3"><h2 className="text-sm font-semibold text-gray-900 mb-1">Skills</h2><p className="text-xs text-gray-600">{data.skills}</p></div>}
            {experience[0].title && <div className="border-t pt-3"><h2 className="text-sm font-semibold text-gray-900 mb-1">Experience</h2>
              {experience.map((exp, i) => exp.title && <div key={i} className="mb-2"><p className="text-xs font-medium text-gray-900">{exp.title}</p><p className="text-xs text-gray-500">{exp.company} • {exp.start} - {exp.end}</p></div>)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResumeBuilder() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><ResumeBuilderContent /></Suspense>;
}