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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const result = await pool.query(
      'SELECT * FROM resumes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Resume not found' }, { status: 404 });
    }

    const resume = result.rows[0];
    return NextResponse.json({
      id: resume.id,
      template: resume.template,
      data: resume.data,
      createdAt: resume.created_at,
    });
  } catch (error) {
    console.error('Get resume error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    await pool.query('DELETE FROM resumes WHERE id = $1 AND user_id = $2', [id, userId]);
    return NextResponse.json({ message: 'Resume deleted' });
  } catch (error) {
    console.error('Delete resume error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}