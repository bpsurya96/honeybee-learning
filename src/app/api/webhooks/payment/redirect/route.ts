import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('id');

    const formData = await request.formData();
    const code = formData.get('code');
    const merchantId = formData.get('merchantId');
    const transactionId = formData.get('transactionId');

    // Here we should verify status via S2S call, but we will rely on the async webhook
    // Redirect user based on success or failure param
    if (code === 'PAYMENT_SUCCESS') {
      return NextResponse.redirect(`${process.env.APP_URL}/track-order?id=${orderId}&status=success`);
    } else {
      return NextResponse.redirect(`${process.env.APP_URL}/checkout?error=payment_failed`);
    }
  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.redirect(`${process.env.APP_URL}/checkout?error=unknown`);
  }
}
