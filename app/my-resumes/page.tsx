'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button, Badge, Modal, Toast } from '@/components/ui';

export default function MyResumes() {
  const router = useRouter();
  const [resumes, setResumes] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; show: boolean }>({ message: '', type: 'success', show: false });

  useEffect(() => {
    checkAuth();
    fetchTemplates();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/dashboard');
      return;
    }
    setUser(session.user);
    fetchResumes(session.access_token);
  };

  const fetchResumes = async (token: string) => {
    try {
      const res = await fetch('/api/resume', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(data);
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
    }
    setLoading(false);
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/templates');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  const handleDelete = async () => {
    if (!resumeToDelete) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      await fetch(`/api/resume/${resumeToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      setResumes(resumes.filter(r => r.id !== resumeToDelete.id));
      setShowDeleteModal(false);
      setToast({ message: 'Resume deleted successfully', type: 'success', show: true });
    } catch (err) {
      setToast({ message: 'Failed to delete resume', type: 'error', show: true });
    }
  };

  const handleDuplicate = async (resume: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title: `${resume.title} (Copy)`,
          template_id: resume.template_id,
          data: resume.data,
        }),
      });
      if (res.ok) {
        const newResume = await res.json();
        setResumes([newResume, ...resumes]);
        setToast({ message: 'Resume duplicated', type: 'success', show: true });
      }
    } catch (err) {
      setToast({ message: 'Failed to duplicate', type: 'error', show: true });
    }
  };

  const getTemplateName = (templateId: number) => {
    const template = templates.find(t => t.id === templateId);
    return template?.name || 'Custom';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
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
            <div className="flex items-center gap-4">
              <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900">Profile</Link>
              <Link href="/billing" className="text-sm text-gray-600 hover:text-gray-900">Billing</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-gray-600 mt-1">Manage all your saved resumes</p>
          </div>
          <Link href="/resume-builder">
            <Button>+ Create New Resume</Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
                <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-500 mb-6">Create your first professional resume</p>
            <Link href="/resume-builder">
              <Button>Create Resume</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div key={resume.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-4 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">{resume.title}</h3>
                  <Badge>{getTemplateName(resume.template_id)}</Badge>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Created {new Date(resume.created_at).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Link href={`/resume/${resume.id}`} className="flex-1">
                    <button className="w-full py-2 bg-[#1F4D3F] text-white rounded-lg text-sm font-medium hover:bg-[#1a4535]">
                      View
                    </button>
                  </Link>
                  <Link href={`/resume-builder?edit=${resume.id}`} className="flex-1">
                    <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                      Edit
                    </button>
                  </Link>
                  <button 
                    onClick={() => { setResumeToDelete(resume); setShowDeleteModal(true); }}
                    className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Resume">
        <p className="text-gray-600 mb-6">Are you sure you want to delete "{resumeToDelete?.title}"? This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1">Delete</Button>
        </div>
      </Modal>

      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
}