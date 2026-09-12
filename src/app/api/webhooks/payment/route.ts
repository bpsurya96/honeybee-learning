import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { response } = body;
    
    const xVerify = request.headers.get('x-verify');
    
    // Verify Checksum
    const saltKey = process.env.PHONEPE_SALT_KEY || '';
    const saltIndex = process.env.PHONEPE_SALT_INDEX || '';
    const stringToHash = response + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const calculatedChecksum = sha256 + '###' + saltIndex;

    if (calculatedChecksum !== xVerify) {
      return NextResponse.json({ error: 'Invalid checksum' }, { status: 400 });
    }

    const decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString('utf-8'));
    const { merchantTransactionId, code, amount, transactionId } = decodedResponse.data;

    const supabase = await createClient();

    // Idempotency check: check if order already successful
    const { data: existingOrder } = await supabase
        .from('orders')
        .select('status')
        .eq('id', merchantTransactionId)
        .single();
        
    if (existingOrder && existingOrder.status !== 'pending') {
        return NextResponse.json({ success: true, message: 'Already processed' });
    }

    const paymentStatus = code === 'PAYMENT_SUCCESS' ? 'success' : 'failed';
    const orderStatus = code === 'PAYMENT_SUCCESS' ? 'processing' : 'pending';

    // Insert Payment Log
    await supabase.from('payments').insert([{
        order_id: merchantTransactionId,
        payment_provider: 'phonepe',
        provider_transaction_id: transactionId,
        amount: amount / 100, // convert back to rupees
        status: paymentStatus,
        failure_reason: code !== 'PAYMENT_SUCCESS' ? code : null
    }]);

    // Update Order Status
    if (code === 'PAYMENT_SUCCESS') {
      await supabase.from('orders').update({
          status: orderStatus,
          is_paid: true
      }).eq('id', merchantTransactionId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
