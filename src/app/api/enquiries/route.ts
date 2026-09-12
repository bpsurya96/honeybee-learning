import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // In case supabase is not configured or fails, we still want the user to go to WhatsApp
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase not configured, skipping DB insert for enquiry');
      return NextResponse.json({ success: true, data, note: 'Skipped DB insert' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from('enquiries')
      .insert([
        {
          type: 'RETURN_GIFTS',
          customer_name: data.buyerName,
          customer_phone: data.whatsappNumber,
          details: data
        }
      ]);

    if (error) {
      console.error('Error saving enquiry to Supabase:', error);
      // We don't throw, we still want the user to proceed to WhatsApp
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process enquiry' }, { status: 500 });
  }
}
