import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobTitle, companyName, skills, yourName } = body;

    const skillsList = skills || 'relevant skills';
    const company = companyName || 'your company';

    const letter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle || 'position'} at ${company}. With my background in ${skillsList}, I am confident that I would be a valuable addition to your team.

Throughout my career, I have developed a passion for continuous learning and professional growth. I thrive in collaborative environments and am committed to delivering results that exceed expectations.

I am excited about the opportunity to contribute to ${company} and would welcome the chance to discuss how my skills and experience align with your needs.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
${yourName || 'Your Name'}`;

    return NextResponse.json({ letter });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}