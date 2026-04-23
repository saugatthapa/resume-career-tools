import { NextRequest, NextResponse } from 'next/server';

const SUMMARIES = [
  `Passionate {{role}} with {{experience}} of experience in {{skills}}. Proven track record of delivering scalable solutions and leading cross-functional teams.`,
  `Results-driven {{role}} with {{experience}} of experience driving growth and efficiency. Demonstrated success in strategic planning and team leadership.`,
  `Innovative {{role}} with {{experience}} of experience in design and development. Passionate about creating memorable experiences.`,
];

const SKILLS_DB: Record<string, string[]> = {
  developer: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'AWS', 'Docker'],
  designer: ['Figma', 'Adobe Creative Suite', 'UI/UX Design', 'Prototyping', 'User Research', 'Design Systems'],
  manager: ['Project Management', 'Strategic Planning', 'Budget Management', 'Team Leadership', 'Agile', 'Scrum'],
  marketing: ['SEO', 'Content Marketing', 'Social Media', 'Google Analytics', 'Email Marketing', 'PPC'],
  default: ['Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Adaptability', 'Leadership'],
};

const HEADLINES = [
  `{{experience}} {{role}} | {{specialty}}`,
  `{{role}} with Proven Track Record | {{specialty}}`,
  `Senior {{role}} | {{specialty}} Expert`,
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, experience, skills } = body;

    const template = SUMMARIES[Math.floor(Math.random() * SUMMARIES.length)];
    const summary = template
      .replace(/{{role}}/g, role || 'professional')
      .replace(/{{experience}}/g, experience || '3+ years')
      .replace(/{{skills}}/g, skills || 'delivering results');

    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}