import { NextResponse } from 'next/server';
import { analytics } from '@/services/analytics';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { eventName, ...rest } = payload;
    
    if (!eventName) {
      return NextResponse.json({ error: 'eventName is required' }, { status: 400 });
    }

    await analytics.trackEvent(eventName, rest);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
