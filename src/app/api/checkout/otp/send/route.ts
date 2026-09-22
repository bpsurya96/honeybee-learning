import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone || phone.length < 10) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const supabase = await createClient();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const { error } = await supabase
      .from('otp_verifications')
      .upsert({
        phone,
        otp,
        expires_at: expiresAt.toISOString(),
        verified: false,
        created_at: new Date().toISOString()
      }, { onConflict: 'phone' });

    if (error) {
      console.error("OTP UPSERT ERROR:", error);
      return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 });
    }

    // LOCAL TESTING LOG
    console.log('\n\n=== 🐝 HONEYBEE OTP FOR ' + phone + ' IS: ' + otp + ' ===\n\n');
    
    try {
      const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
      
      let formattedPhone = phone;
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+91' + formattedPhone;
      }

      await client.messages.create({
        body: `Your HoneyBee Learning OTP is ${otp}. It is valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone
      });
      console.log('Twilio SMS sent successfully!');
    } catch (twilioError) {
      console.error("TWILIO ERROR:", twilioError.message);
      return NextResponse.json({ error: 'Failed to send SMS via Twilio: ' + twilioError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error("GENERAL ERROR:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
