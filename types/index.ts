export interface User {
  id: number;
  email: string;
  password: string;
  name: string | null;
  isPremium: boolean;
  downloadsToday: number;
  lastDownloadDate: string | null;
  createdAt: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string | null;
  isPremium: boolean;
  downloadsToday: number;
  lastDownloadDate: string | null;
  createdAt: string;
}

export interface Resume {
  id: number;
  userId: number;
  template: string;
  data: ResumeData;
  createdAt: string;
}

export interface ResumeData {
  fullName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  summary?: string;
  skills?: string;
  experience?: Experience[];
  education?: Education[];
}

export interface Experience {
  title: string;
  company: string;
  start: string;
  end: string;
  description: string;
}

export interface Education {
  degree: string;
  school: string;
  year: string;
  gpa?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

export interface ApiResponse<T = unknown> {
  message?: string;
  token?: string;
  user?: UserResponse;
  data?: T;
}

export interface AISummarizeRequest {
  role: string;
  experience?: string;
  skills?: string;
}

export interface AISkillsRequest {
  jobTitle: string;
  industry?: string;
}

export interface AIHeadlineRequest {
  role: string;
  experience?: string;
  specialty?: string;
}

export interface AICoverLetterRequest {
  jobTitle: string;
  companyName: string;
  skills?: string;
  yourName?: string;
}