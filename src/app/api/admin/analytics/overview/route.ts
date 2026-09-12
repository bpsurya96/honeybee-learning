import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Ensure user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 1. Total Users
    const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

    // 2. Total Orders
    const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true });

    // 3. Total Revenue
    const { data: orders } = await supabase.from('orders').select('total_amount').eq('is_paid', true);
    const revenue = orders ? orders.reduce((acc, order) => acc + (order.total_amount || 0), 0) : 0;

    // 4. Cart Abandonment Rate (rough estimate: carts without successful orders vs total carts)
    const { count: totalCarts } = await supabase.from('carts').select('*', { count: 'exact', head: true });

    return NextResponse.json({
      overview: {
        totalUsers: totalUsers || 0,
        totalOrders: totalOrders || 0,
        revenue,
        totalCarts: totalCarts || 0
      }
    });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
