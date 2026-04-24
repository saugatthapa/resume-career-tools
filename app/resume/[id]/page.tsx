'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { supabase } from '@/lib/supabase';

interface ResumeData {
  contact: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  summary: string;
  skills: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    start: string;
    end: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    year: string;
  }>;
}

interface Resume {
  id: number;
  template: string;
  title: string;
  data: ResumeData;
  created_at: string;
}

export default function ResumeView() {
  const params = useParams();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        const response = await fetch(`/api/resume/${params.id}`, {
          headers: session ? {
            'Authorization': `Bearer ${session.access_token}`
          } : {}
        });

        if (!response.ok) {
          const err = await response.json();
          setError(err.message || 'Resume not found');
          return;
        }

        const data = await response.json();
        setResume(data);
      } catch (err) {
        setError('Failed to load resume');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchResume();
    }
  }, [params.id]);

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
      pdf.save(`${resume?.title || 'resume'}.pdf`);
    } catch (err) {
      alert('Error generating PDF');
    }
    setDownloading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F4D3F]"></div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Resume Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This resume may not exist or you don\'t have access.'}</p>
          <Link href="/my-resumes" className="px-6 py-3 bg-[#1F4D3F] text-white rounded-xl font-medium hover:bg-[#1a4535] transition">
            Back to My Resumes
          </Link>
        </div>
      </div>
    );
  }

  const { contact, summary, skills, experience, education } = resume.data;
  const template = resume.template || 'modern';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/my-resumes" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1F4D3F] to-[#2D6B56] rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-900">ResumeCraft</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href={`/resume-builder?edit=${resume.id}`}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
              >
                Edit
              </Link>
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

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{resume.title || 'My Resume'}</h1>
              <p className="text-gray-500 text-sm">Created {new Date(resume.created_at).toLocaleDateString()}</p>
            </div>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm capitalize">{template}</span>
          </div>
        </div>

        <div
          ref={previewRef}
          className="bg-white rounded-2xl shadow-lg p-12 aspect-[8.5/11] overflow-hidden"
          style={{
            background: template === 'classic' ? '#fff' : template === 'creative' ? '#faf5ff' : '#fff',
          }}
        >
          <div className="space-y-6">
            {contact?.fullName && (
              <div className="text-center border-b-2 pb-4" style={{ borderColor: '#1F4D3F' }}>
                <h1 className="text-3xl font-bold text-gray-900">{contact.fullName}</h1>
                {contact.jobTitle && <p className="text-lg text-gray-600 mt-1">{contact.jobTitle}</p>}
                <div className="flex flex-wrap justify-center gap-3 mt-3 text-sm text-gray-500">
                  {contact.email && <span>{contact.email}</span>}
                  {contact.phone && <span>• {contact.phone}</span>}
                  {contact.location && <span>• {contact.location}</span>}
                  {contact.linkedin && <span>• {contact.linkedin}</span>}
                </div>
              </div>
            )}
            
            {summary && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3" style={{ color: '#1F4D3F' }}>Summary</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
              </div>
            )}
            
            {skills && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3" style={{ color: '#1F4D3F' }}>Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.split(',').map((skill, i) => (
                    <span key={i} className="text-sm px-3 py-1 bg-gray-100 rounded-full text-gray-700">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {experience?.some(e => e.title) && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3" style={{ color: '#1F4D3F' }}>Experience</h2>
                <div className="space-y-4">
                  {experience.filter(e => e.title).map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-base font-semibold text-gray-900">{exp.title}</p>
                          <p className="text-sm text-gray-600">{exp.company}</p>
                        </div>
                        <p className="text-sm text-gray-500">{exp.start} - {exp.end || 'Present'}</p>
                      </div>
                      {exp.description && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {education?.some(e => e.degree) && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3" style={{ color: '#1F4D3F' }}>Education</h2>
                <div className="space-y-3">
                  {education.filter(e => e.degree).map((edu) => (
                    <div key={edu.id}>
                      <p className="text-base font-semibold text-gray-900">{edu.degree}</p>
                      <p className="text-sm text-gray-600">{edu.school} {edu.year && `• ${edu.year}`}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}