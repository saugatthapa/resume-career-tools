import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const { data, error } = await supabase
    .from('resume_templates')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: 'Template not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

  try {
    const body = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data, error } = await supabase
      .from('resume_templates')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  await supabase.from('resume_templates').delete().eq('id', params.id);

  return NextResponse.json({ message: 'Template deleted' });
}