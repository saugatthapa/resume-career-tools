import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const FREE_DAILY_LIMIT = 2;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const profile = await supabaseAdmin
    .from('user_profiles')
    .select('is_premium')
    .eq('id', user.id)
    .single();

  if (profile.data?.is_premium) {
    return NextResponse.json({ allowed: true, limit: null, used: 0, remaining: null });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const downloads = await supabaseAdmin
    .from('download_logs')
    .select('id')
    .eq('user_id', user.id)
    .gte('downloaded_at', today.toISOString());

  const used = downloads.data?.length || 0;
  const remaining = Math.max(0, FREE_DAILY_LIMIT - used);

  return NextResponse.json({
    allowed: remaining > 0,
    limit: FREE_DAILY_LIMIT,
    used,
    remaining
  });
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { resume_id } = body;

  if (!resume_id) {
    return NextResponse.json({ message: 'Resume ID required' }, { status: 400 });
  }

  await supabaseAdmin
    .from('download_logs')
    .insert({
      user_id: user.id,
      resume_id,
    });

  return NextResponse.json({ message: 'Download logged' });
}