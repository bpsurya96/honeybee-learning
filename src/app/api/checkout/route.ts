import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, totalPrice, customerPhone } = body;

    // PhonePe Credentials from .env
    const merchantId = process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT';
    const saltKey = process.env.PHONEPE_SALT_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
    const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
    
    // Use UAT environment if the merchant ID looks like a test one, otherwise PROD
    const isTestEnv = merchantId === 'PGTESTPAYUAT' || merchantId.includes('TEST');
    const baseUrl = isTestEnv 
      ? 'https://api-preprod.phonepe.com/apis/pg-sandbox'
      : 'https://api.phonepe.com/apis/hermes';

    const merchantTransactionId = `MT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Prepare PhonePe Payload
    const data = {
      merchantId: merchantId,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: `MUID-${Date.now()}`,
      name: "HoneyBee Customer",
      amount: totalPrice * 100, // Amount in paise
      redirectUrl: `https://honeybeelearning.co.in/api/phonepe-webhook`,
      redirectMode: "POST",
      mobileNumber: customerPhone || "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    // 1. Base64 Encode the payload
    const payloadBuffer = Buffer.from(JSON.stringify(data));
    const base64Payload = payloadBuffer.toString('base64');

    // 2. Generate X-VERIFY checksum (SHA256(base64Payload + "/pg/v1/pay" + saltKey) + "###" + saltIndex)
    const stringToSign = base64Payload + "/pg/v1/pay" + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToSign).digest('hex');
    const checksum = sha256 + '###' + saltIndex;

    // We skip the actual fetch if keys are missing to prevent crashing during demo
    if (merchantId === 'PGTESTPAYUAT' && !process.env.PHONEPE_SALT_KEY) {
       console.log("Mocking PhonePe Request due to missing credentials", { base64Payload, checksum });
       // Return a mock success URL
       return NextResponse.json({ 
         success: true, 
         url: `/admin?mock_payment_success=${merchantTransactionId}` 
       });
    }

    // Actual API Call to PhonePe
    const response = await fetch(`${baseUrl}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-CLIENT-ID': merchantId,
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    const result = await response.json();

    if (result.success && result.data && result.data.instrumentResponse) {
      return NextResponse.json({ 
        success: true, 
        url: result.data.instrumentResponse.redirectInfo.url 
      });
    } else {
      console.error('PhonePe Error:', result);
      return NextResponse.json({ success: false, error: 'Payment initiation failed' }, { status: 400 });
    }

  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
