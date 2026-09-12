import { createClient } from '@/lib/supabase/server';

export const db = {
  // Products are loaded from local JSON files (src/data/...) via src/lib/data.ts
  
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
