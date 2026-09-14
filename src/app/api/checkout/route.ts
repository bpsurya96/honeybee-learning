import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getProductById } from '@/lib/data';
import { sendWhatsAppNotification } from '@/lib/whatsapp';

export async function POST(request: Request) {
  try {
    const { items, userId, sessionId, shipping_address, phone, customer_name } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!phone || !shipping_address || !customer_name) {
      return NextResponse.json({ error: 'Missing customer details' }, { status: 400 });
    }

    const supabase = await createClient();

    // Verify phone is actually verified
    const { data: otpRec } = await supabase.from('otp_verifications').select('verified').eq('phone', phone).single();
    if (!otpRec || !otpRec.verified) {
      return NextResponse.json({ error: 'Phone number not verified' }, { status: 403 });
    }

    // Generate unique order ID
    const orderNumber = 'ORD-' + Date.now();

    // Calculate total server-side
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await getProductById(item.productId);
      if (!product || product.is_deleted) {
         return NextResponse.json({ error: `Product ${item.title} not found or unavailable` }, { status: 400 });
      }
      const unitPrice = product.price;
      totalAmount += unitPrice * item.quantity;
      
      orderItems.push({
        product_id: item.productId,
        product_name: product.title,
        price: unitPrice,
        quantity: item.quantity,
      });
    }

    // Create Order in DB
    const orderData = {
      order_number: orderNumber,
      user_id: userId || null,
      total_amount: totalAmount,
      status: 'pending',
      payment_method: 'cash_on_delivery',
      is_paid: false,
      shipping_address: shipping_address
    };

    const { data: order, error: orderError } = await supabase.from('orders').insert(orderData).select().single();
    
    if (orderError || !order) {
        console.error("Order Insert Error:", orderError);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Create Order Items
    const itemsToInsert = orderItems.map(oi => ({ ...oi, order_id: order.id }));
    const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);

    if (itemsError) {
        console.error("Order Items Insert Error:", itemsError);
        return NextResponse.json({ error: 'Failed to add items to order' }, { status: 500 });
    }

    // Send WhatsApp Notifications async
    const notifData = {
        order_number: orderNumber,
        customer_name,
        customer_phone: phone,
        total_amount: totalAmount,
        status: 'Pending'
    };

    sendWhatsAppNotification('customer', notifData);
    sendWhatsAppNotification('admin', notifData);

    return NextResponse.json({ 
        success: true, 
        orderId: order.id,
        orderNumber: orderNumber
    });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
