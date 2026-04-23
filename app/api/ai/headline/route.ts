import { NextRequest, NextResponse } from 'next/server';

const HEADLINES = [
  `{{experience}} {{role}} | {{specialty}}`,
  `{{role}} with Proven Track Record | {{specialty}}`,
  `Senior {{role}} | {{specialty}} Expert`,
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, experience, specialty } = body;

    const template = HEADLINES[Math.floor(Math.random() * HEADLINES.length)];
    const headline = template
      .replace(/{{role}}/g, role || 'Professional')
      .replace(/{{experience}}/g, experience || 'Experienced')
      .replace(/{{specialty}}/g, specialty || 'Results-Driven');

    return NextResponse.json({ headline });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}