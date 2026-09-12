import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Fetch orders with order items
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      payment_status,
      total_amount,
      notes,
      age_group,
      created_at,
      profiles (
        full_name,
        email,
        phone
      ),
      order_items (
        product_name_snapshot,
        quantity,
        personalisation_data
      )
    `)
    .order('created_at', { ascending: false });

  if (error || !orders) {
    return new NextResponse('Error fetching orders', { status: 500 });
  }

  // Generate CSV
  let csv = 'Order Number,Date,Customer Name,Email,Phone,Status,Payment Status,Total Amount,Age Group,Notes,Items\n';
  
  orders.forEach((order: any) => {
    const itemsDesc = (order.order_items || []).map((item: any) => {
      let desc = `${item.quantity}x ${item.product_name_snapshot}`;
      if (item.personalisation_data) {
        if (item.personalisation_data.childName) {
           desc += ` (Name: ${item.personalisation_data.childName})`;
        }
      }
      return desc;
    }).join('; ');

    const row = [
      order.order_number,
      new Date(order.created_at).toLocaleDateString(),
      `"${order.profiles?.full_name || ''}"`,
      `"${order.profiles?.email || ''}"`,
      `"${order.profiles?.phone || ''}"`,
      order.status,
      order.payment_status,
      order.total_amount,
      `"${order.age_group || ''}"`,
      `"${(order.notes || '').replace(/"/g, '""')}"`, // escape quotes in notes
      `"${itemsDesc.replace(/"/g, '""')}"`
    ];
    csv += row.join(',') + '\n';
  });

  const headers = new Headers();
  headers.set('Content-Type', 'text/csv');
  headers.set('Content-Disposition', `attachment; filename="honeybee_orders_${new Date().toISOString().split('T')[0]}.csv"`);

  return new NextResponse(csv, { status: 200, headers });
}
