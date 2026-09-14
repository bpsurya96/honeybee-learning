import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/services/db';
import { getProductById } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const { items, userId, sessionId, ageGroup, notes } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Generate unique order ID
    const orderId = 'ORD-' + Date.now();

    // 1. Calculate total server-side
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await getProductById(item.productId);
      if (!product) {
         return NextResponse.json({ error: 'Product not found' }, { status: 400 });
      }
      const unitPrice = product.price; // Server-side price validation
      totalAmount += unitPrice * item.quantity;
      
      orderItems.push({
        product_id: item.productId,
        product_name: product.title,
        price: unitPrice,
        quantity: item.quantity,
        
      });
    }

    // 2. Create Order in DB
    const orderData = {
      order_number: orderId,
      user_id: userId || null,
      total_amount: totalAmount,
      status: 'pending',
      age_group: ageGroup || null,
      notes: notes || null
    };

    const order = await db.orders.create(orderData, orderItems);

    // 3. Setup PhonePe Payment Request
    const merchantId = process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID;
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;
    const env = process.env.PHONEPE_ENV || 'UAT';

    const redirectUrl = `${process.env.APP_URL}/api/webhooks/payment/redirect?id=${order.id}`;
    const callbackUrl = `${process.env.APP_URL}/api/webhooks/payment`;

    const paymentPayload = {
      merchantId: merchantId,
      merchantTransactionId: order.id,
      merchantUserId: userId || sessionId || 'anonymous',
      amount: totalAmount * 100, // in paise
      redirectUrl: redirectUrl,
      redirectMode: 'POST',
      callbackUrl: callbackUrl,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
    const stringToHash = base64Payload + '/pg/v1/pay' + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const checksum = sha256 + '###' + saltIndex;

    const phonePeUrl = env === 'PROD' 
      ? 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';

    // Optionally: send to phonePe and return instrument URL
    /*
    const response = await fetch(phonePeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': merchantId
      },
      body: JSON.stringify({ request: base64Payload })
    });
    
    const data = await response.json();
    return NextResponse.json({ url: data.data.instrumentResponse.redirectInfo.url });
    */

    // For now, return payload so client can submit form or we mock redirect
    return NextResponse.json({ 
        success: true, 
        orderId: order.id,
        phonePePayload: { request: base64Payload, checksum, url: phonePeUrl }
    });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

