import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Fetch user profile with subscription info
  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return NextResponse.json({
    id: user.id,
    email: user.email,
    fullName: profile?.full_name || user.user_metadata?.full_name,
    avatarUrl: profile?.avatar_url,
    isPremium: profile?.is_premium || false,
    subscriptionStatus: profile?.subscription_status || 'inactive',
    subscriptionPlan: profile?.subscription_plan || 'free',
    createdAt: user.created_at,
  });
}

export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { full_name, avatar_url } = body;

    // Update user metadata
    await supabaseAdmin.auth.updateUser({
      data: { full_name }
    });

    // Update profile
    await supabaseAdmin
      .from('user_profiles')
      .update({ 
        full_name, 
        avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    return NextResponse.json({ message: 'Profile updated' });
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // This handles premium upgrade
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, paypal_subscription_id, status } = body;

    if (action === 'upgrade') {
      await supabaseAdmin
        .from('user_profiles')
        .update({
          is_premium: true,
          subscription_status: 'active',
          subscription_plan: 'pro',
          paypal_subscription_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
    } else if (action === 'cancel') {
      await supabaseAdmin
        .from('user_profiles')
        .update({
          is_premium: false,
          subscription_status: 'cancelled',
          subscription_plan: 'free',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
    }

    return NextResponse.json({ message: 'Subscription updated' });
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}