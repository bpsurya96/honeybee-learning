import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();
    if (!phone || !otp) {
      return NextResponse.json({ error: 'Missing phone or OTP' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Fetch OTP record
    const { data: record, error } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error || !record) {
      return NextResponse.json({ error: 'OTP not found. Please request a new one.' }, { status: 400 });
    }

    // 2. Check Expiry
    if (new Date() > new Date(record.expires_at)) {
      return NextResponse.json({ error: 'OTP has expired.' }, { status: 400 });
    }

    // 3. Verify Match
    if (record.otp !== otp) {
      return NextResponse.json({ error: 'Incorrect OTP.' }, { status: 400 });
    }

    // 4. Mark as verified
    await supabase.from('otp_verifications').update({ verified: true }).eq('phone', phone);

    // 5. Update user profile if logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({ phone_verified: true, phone: phone }).eq('id', user.id);
    }

    return NextResponse.json({ success: true, message: 'Phone verified successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
