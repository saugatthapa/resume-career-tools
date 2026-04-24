import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscription_id } = body;

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

    // Cancel subscription
    const cancelRes = await fetch(`https://api-m.${mode}.paypal.com/v1/billing/subscriptions/${subscription_id}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason: 'User requested cancellation',
      }),
    });

    if (cancelRes.ok || cancelRes.status === 204) {
      return NextResponse.json({ message: 'Subscription cancelled' });
    }

    const errorData = await cancelRes.json();
    return NextResponse.json({ message: errorData.message || 'Failed to cancel' }, { status: 400 });

  } catch (error) {
    console.error('PayPal cancel error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}