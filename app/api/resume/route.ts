import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const getUserId = (request: NextRequest): number | null => {
  const auth = request.headers.get('authorization');
  if (!auth) return null;
  try {
    const token = auth.replace('Bearer ', '');
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    return decoded.id;
  } catch {
    return null;
  }
};

export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await pool.query(
      'SELECT id, template, data, created_at FROM resumes WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    return NextResponse.json(result.rows.map(r => ({
      id: r.id,
      template: r.template,
      data: r.data,
      createdAt: r.created_at,
    })));
  } catch (error) {
    console.error('Get resumes error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { template, data } = body;

    const result = await pool.query(
      'INSERT INTO resumes (user_id, template, data) VALUES ($1, $2, $3) RETURNING id, template, data, created_at',
      [userId, template || 'modern', JSON.stringify(data)]
    );

    const resume = result.rows[0];
    return NextResponse.json({
      id: resume.id,
      template: resume.template,
      data: resume.data,
      createdAt: resume.created_at,
    }, { status: 201 });
  } catch (error) {
    console.error('Save resume error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}