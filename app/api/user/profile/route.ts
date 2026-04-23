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
      'SELECT id, email, name, is_premium, downloads_today, last_download_date, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      isPremium: user.is_premium,
      downloadsToday: user.downloads_today,
      lastDownloadDate: user.last_download_date,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name } = body;

    const result = await pool.query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, email, name, is_premium',
      [name, userId]
    );

    const user = result.rows[0];
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      isPremium: user.is_premium,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET is_premium = TRUE WHERE id = $1 RETURNING id, email, name, is_premium',
      [userId]
    );

    const user = result.rows[0];
    return NextResponse.json({ 
      message: 'Upgraded to premium', 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        isPremium: user.is_premium,
      } 
    });
  } catch (error) {
    console.error('Upgrade error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}