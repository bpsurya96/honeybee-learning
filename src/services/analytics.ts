import { createClient } from '@/lib/supabase/server';

export const analytics = {
  async trackEvent(eventName: string, payload: {
    userId?: string;
    sessionId?: string;
    pageUrl?: string;
    productId?: string;
    orderId?: string;
    metadata?: Record<string, any>;
  }) {
    try {
      const supabase = await createClient();
      await supabase.from('analytics_events').insert([{
        event_name: eventName,
        user_id: payload.userId,
        session_id: payload.sessionId,
        page_url: payload.pageUrl,
        product_id: payload.productId,
        order_id: payload.orderId,
        metadata: payload.metadata
      }]);
    } catch (error) {
      console.error('Failed to track analytics event:', error);
      // Fail silently to not disrupt user flow
    }
  }
};
