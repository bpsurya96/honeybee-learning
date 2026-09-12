import { createClient } from '@/lib/supabase/server';

export const db = {
  // Products are loaded from local JSON files (src/data/...) via src/lib/data.ts
  
  cart: {
    async getOrCreate(userId: string | null, sessionId: string | null) {
      const supabase = await createClient();
      
      let query = supabase.from('carts').select('*, cart_items(*)').eq('status', 'active');
      if (userId) query = query.eq('user_id', userId);
      else if (sessionId) query = query.eq('session_id', sessionId);
      else return null;

      const { data: existingCarts, error } = await query.limit(1);
      
      if (error) throw error;
      
      if (existingCarts && existingCarts.length > 0) {
        return existingCarts[0];
      }

      // Create new
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert([{ user_id: userId, session_id: sessionId }])
        .select('*, cart_items(*)')
        .single();
        
      if (createError) throw createError;
      return newCart;
    }
  },
  orders: {
    async create(orderData: any, itemsData: any[]) {
      const supabase = await createClient();
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();
      
      if (orderError) throw orderError;

      const items = itemsData.map(item => ({
        ...item,
        order_id: order.id
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(items);
        
      if (itemsError) throw itemsError;
      
      return order;
    }
  }
};
