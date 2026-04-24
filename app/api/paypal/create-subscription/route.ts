import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, plan_id = 'P-5month' } = body;

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const mode = process.env.PAYPAL_MODE || 'sandbox';

    if (!clientId || !clientSecret) {
      return NextResponse.json({ message: 'PayPal not configured' }, { status: 500 });
    }

    // Get PayPal access token
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const tokenRes = await fetch(`https://api-m.${mode}.paypal.com/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenRes.json();
    
    if (!tokenData.access_token) {
      return NextResponse.json({ message: 'Failed to get PayPal token' }, { status: 500 });
    }

    const accessToken = tokenData.access_token;

    // Create subscription
    const subscriptionRes = await fetch(`https://api-m.${mode}.paypal.com/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `sub-${Date.now()}-${user_id}`,
      },
      body: JSON.stringify({
        plan_id: plan_id,
        subscriber: {
          name: { given_name: 'Customer' },
          email_address: 'customer@example.com',
        },
        custom_id: user_id,
        application_context: {
          brand_name: 'ResumeCraft',
          landing_page: 'BILLING',
          user_action: 'SUBSCRIBE',
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://resumecraft.app'}/billing?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://resumecraft.app'}/billing?cancelled=true`,
        },
      }),
    });

    const subscriptionData = await subscriptionRes.json();

    if (subscriptionData.id) {
      // Find approval URL
      const approvalUrl = subscriptionData.links?.find((link: any) => link.rel === 'approve')?.href;
      
      return NextResponse.json({
        subscriptionId: subscriptionData.id,
        approvalUrl,
        status: 'pending',
      });
    }

    return NextResponse.json({ message: subscriptionData.message || 'Failed to create subscription' }, { status: 400 });

  } catch (error) {
    console.error('PayPal subscription error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}