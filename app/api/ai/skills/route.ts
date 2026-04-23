import { NextRequest, NextResponse } from 'next/server';

const SKILLS_DB: Record<string, string[]> = {
  developer: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'AWS', 'Docker'],
  designer: ['Figma', 'Adobe Creative Suite', 'UI/UX Design', 'Prototyping', 'User Research'],
  manager: ['Project Management', 'Strategic Planning', 'Team Leadership', 'Agile', 'Scrum'],
  marketing: ['SEO', 'Content Marketing', 'Social Media', 'Google Analytics'],
  default: ['Communication', 'Problem Solving', 'Teamwork', 'Time Management'],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobTitle } = body;
    
    const jobLower = (jobTitle || '').toLowerCase();
    let skills: string[];
    
    if (jobLower.includes('dev') || jobLower.includes('engineer')) {
      skills = SKILLS_DB.developer;
    } else if (jobLower.includes('design')) {
      skills = SKILLS_DB.designer;
    } else if (jobLower.includes('manager')) {
      skills = SKILLS_DB.manager;
    } else if (jobLower.includes('market')) {
      skills = SKILLS_DB.marketing;
    } else {
      skills = SKILLS_DB.default;
    }

    return NextResponse.json({ skills });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}