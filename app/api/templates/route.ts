import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const { data, error } = await supabase
    .from('resume_templates')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    return NextResponse.json({ message: 'Failed to fetch templates' }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is admin
  if (user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data, error } = await supabase
      .from('resume_templates')
      .insert(body)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}