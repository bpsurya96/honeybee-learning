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

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
