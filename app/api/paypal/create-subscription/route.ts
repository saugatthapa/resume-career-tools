import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id } = body;

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const mode = process.env.PAYPAL_MODE || 'sandbox';

    if (!clientId || !clientSecret) {
      return NextResponse.json({ message: 'PayPal not configured' }, { status: 500 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://resumecraft.app';

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

    const orderRes = await fetch(`https://api-m.${mode}.paypal.com/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: user_id,
          description: 'ResumeCraft Pro Subscription - $5/month',
          amount: {
            currency_code: 'USD',
            value: '5.00'
          }
        }],
        application_context: {
          brand_name: 'ResumeCraft',
          user_action: 'CONTINUE',
          return_url: `${siteUrl}/billing?success=true`,
          cancel_url: `${siteUrl}/billing?cancelled=true`
        }
      }),
    });

    const orderData = await orderRes.json();

    if (orderData.id) {
      const approvalUrl = orderData.links?.find((link: any) => link.rel === 'approve')?.href;
      
      return NextResponse.json({
        orderId: orderData.id,
        approvalUrl,
      });
    }

    return NextResponse.json({ 
      message: orderData.message || 'Failed to create order',
      details: orderData
    }, { status: 400 });

  } catch (error) {
    console.error('PayPal order error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}