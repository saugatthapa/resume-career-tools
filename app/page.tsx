'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1F4D3F] to-[#2D6B56] rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-900">ResumeCraft</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Features</Link>
              <Link href="/cover-letter" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Cover Letters</Link>
              <Link href="/ai-tools" className="text-gray-600 hover:text-gray-900 text-sm font-medium">AI Tools</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Pricing</Link>
              <Link href="/dashboard" className="px-6 py-2.5 bg-[#1F4D3F] text-white rounded-full font-medium text-sm hover:bg-[#1a4535] transition shadow-lg shadow-[#1F4D3F]/25">
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[#1F4D3F]/10 rounded-full mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-[#1F4D3F]">Free to get started</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Build a Resume That
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1F4D3F] to-[#2D6B56]"> Gets Hired</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Create professional resumes in minutes with our AI-powered builder. No design skills needed—just pick a template and start writing.
              </p>
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20 focus:border-[#1F4D3F] transition"
                    required
                  />
                  <button type="submit" className="px-8 py-3.5 bg-[#1F4D3F] text-white rounded-full font-semibold hover:bg-[#1a4535] transition shadow-lg shadow-[#1F4D3F]/25">
                    Get Started
                  </button>
                </form>
              ) : (
                <div className="flex items-center space-x-3 text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Redirecting you to dashboard...</span>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-4">No credit card required • 100% free to start</p>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#1F4D3F]/20 to-[#2D6B56]/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-2xl border border-gray-200">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-8 bg-gradient-to-r from-[#1F4D3F]/20 to-[#1F4D3F]/10 rounded-lg"></div>
                  <div className="h-4 w-3/4 bg-gray-300/50 rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-300/50 rounded"></div>
                  <div className="h-24 bg-gradient-to-r from-[#1F4D3F]/10 to-transparent rounded-lg border-l-4 border-[#1F4D3F]"></div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-200/50 rounded"></div>
                    <div className="h-3 w-5/6 bg-gray-200/50 rounded"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-16 bg-[#1F4D3F]/10 rounded-lg"></div>
                    <div className="h-16 bg-[#1F4D3F]/10 rounded-lg"></div>
                    <div className="h-16 bg-[#1F4D3F]/10 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-12 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm text-gray-500 mb-8">Trusted by professionals from</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
            <span className="text-xl font-bold text-gray-400">Google</span>
            <span className="text-xl font-bold text-gray-400">Microsoft</span>
            <span className="text-xl font-bold text-gray-400">Amazon</span>
            <span className="text-xl font-bold text-gray-400">Meta</span>
            <span className="text-xl font-bold text-gray-400">Apple</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#1F4D3F] font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">Everything You Need to Land Your Dream Job</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Powerful tools designed to help you create compelling resumes and cover letters with ease.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#1F4D3F]/30 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-[#1F4D3F] to-[#2D6B56] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#1F4D3F]/20 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Resume Builder</h3>
              <p className="text-gray-600 leading-relaxed">Step-by-step wizard guides you through creating a professional resume. Our AI helps you write compelling content.</p>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#1F4D3F]/30 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-5 7V3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cover Letter Generator</h3>
              <p className="text-gray-600 leading-relaxed">Generate tailored cover letters in seconds. Just enter the job details and let our AI craft a compelling letter.</p>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#1F4D3F]/30 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 3v4m-3-3h4m9-3v4m-3-3h4m2.5 9.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Tools</h3>
              <p className="text-gray-600 leading-relaxed">Get AI suggestions for resume summaries, skills, and headlines. Stay ahead with smart recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#1F4D3F] font-semibold text-sm uppercase tracking-wider">Templates</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">Beautiful Templates That Stand Out</h2>
            <p className="text-xl text-gray-600">Choose from a variety of professionally designed templates</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 group-hover:shadow-xl group-hover:border-[#1F4D3F]/30 transition-all duration-300">
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg mb-4 flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#1F4D3F]/20 rounded"></div>
                </div>
                <h4 className="font-semibold text-gray-900">Modern</h4>
                <p className="text-sm text-gray-500">Clean and professional</p>
              </div>
            </div>
            <div className="group">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 group-hover:shadow-xl group-hover:border-[#1F4D3F]/30 transition-all duration-300">
                <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded"></div>
                </div>
                <h4 className="font-semibold text-gray-900">Classic</h4>
                <p className="text-sm text-gray-500">Timeless elegance</p>
              </div>
            </div>
            <div className="group">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 group-hover:shadow-xl group-hover:border-[#1F4D3F]/30 transition-all duration-300">
                <div className="aspect-[3/4] bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded"></div>
                </div>
                <h4 className="font-semibold text-gray-900">Creative</h4>
                <p className="text-sm text-gray-500">Make an impression</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#1F4D3F] font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">Loved by Job Seekers</h2>
            <p className="text-xl text-gray-600">See what our users have to say</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6">"ResumeCraft helped me land my dream job at Google! The templates are beautiful and the AI suggestions made my resume stand out."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#1F4D3F]/20 rounded-full flex items-center justify-center text-[#1F4D3F] font-semibold">M</div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Michael Chen</p>
                  <p className="text-sm text-gray-500">Software Engineer at Google</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6">"I got 3 interviews in the first week after using ResumeCraft. The cover letter generator saved me so much time. Highly recommend!"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">S</div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Marketing Manager</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6">"As a career changer, I wasn't sure how to highlight my skills. ResumeCraft's AI tools helped me present my experience perfectly."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-semibold">J</div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">James Wilson</p>
                  <p className="text-sm text-gray-500">Product Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#1F4D3F] font-semibold text-sm uppercase tracking-wider">Pricing</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Start free, upgrade when you need more</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <div className="mb-6">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Free</span>
                <div className="flex items-baseline mt-2">
                  <span className="text-5xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-500 ml-2">/forever</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">3 resume templates</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">2 downloads/day</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Basic AI tools</span>
                </li>
              </ul>
              <Link href="/dashboard" className="block w-full py-3 text-center border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition">
                Get Started Free
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-[#1F4D3F] to-[#2D6B56] p-8 rounded-2xl text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Most Popular</div>
              <div className="mb-6">
                <span className="text-sm font-medium text-white/80 uppercase tracking-wider">Pro</span>
                <div className="flex items-baseline mt-2">
                  <span className="text-5xl font-bold">$5</span>
                  <span className="text-white/70 ml-2">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-white mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>All templates unlocked</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-white mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Unlimited downloads</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-white mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>No watermark</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-white mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Priority AI access</span>
                </li>
              </ul>
              <Link href="/pricing" className="block w-full py-3 text-center bg-white text-[#1F4D3F] rounded-xl font-semibold hover:bg-gray-100 transition">
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#1F4D3F] to-[#2D6B56]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Build Your Resume?</h2>
          <p className="text-xl text-white/80 mb-10">Join thousands who landed their dream jobs with our resume builder.</p>
          <Link href="/dashboard" className="inline-flex px-10 py-4 bg-white text-[#1F4D3F] rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-xl">
            Start Building Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-[#1F4D3F] rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="font-semibold">ResumeCraft</span>
              </div>
              <p className="text-gray-400 text-sm">Build professional resumes that get you hired.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/resume-builder" className="hover:text-white transition">Resume Builder</Link></li>
                <li><Link href="/cover-letter" className="hover:text-white transition">Cover Letters</Link></li>
                <li><Link href="/ai-tools" className="hover:text-white transition">AI Tools</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Career Tips</a></li>
                <li><a href="#" className="hover:text-white transition">Resume Templates</a></li>
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 ResumeCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}