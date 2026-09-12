'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function approveOrder(orderId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // Verify ownership
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, user_id, status')
    .eq('id', orderId)
    .single();

  if (orderError || !order || order.user_id !== user.id) {
    throw new Error('Order not found or unauthorized');
  }

  if (order.status === 'approved' || order.status === 'completed') {
    throw new Error('Order is already approved or completed');
  }

  // Update status to approved
  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: 'approved' })
    .eq('id', orderId);

  if (updateError) throw updateError;

  // Log activity
  await supabase.from('order_activity').insert({
    order_id: orderId,
    user_id: user.id,
    actor_type: 'customer',
    action: 'ORDER_APPROVED',
    description: 'Customer approved the personalised ebook.'
  });

  revalidatePath(`/my-orders/${orderId}`);
  return { success: true };
}

export async function requestModification(orderId: string, orderItemId: string, requestText: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // Verify ownership and get current modification count
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(`
      id, 
      user_id, 
      status,
      order_modification_requests ( id )
    `)
    .eq('id', orderId)
    .single();

  if (orderError || !order || order.user_id !== user.id) {
    throw new Error('Order not found or unauthorized');
  }

  const existingModificationsCount = order.order_modification_requests.length;

  if (existingModificationsCount >= 2) {
    throw new Error('Maximum modification requests (2) reached for this order.');
  }

  if (order.status === 'modification_requested') {
    throw new Error('A modification is already in progress.');
  }

  const newModificationNumber = existingModificationsCount + 1;

  // Insert the new modification request
  const { error: insertError } = await supabase
    .from('order_modification_requests')
    .insert({
      order_id: orderId,
      order_item_id: orderItemId,
      requested_by: user.id,
      modification_number: newModificationNumber,
      request_text: requestText,
      status: 'requested'
    });

  if (insertError) {
    // Check if it's the unique constraint violation
    if (insertError.code === '23505') {
      throw new Error('A modification with this number already exists.');
    }
    throw insertError;
  }

  // Update order status
  await supabase
    .from('orders')
    .update({ status: 'modification_requested' })
    .eq('id', orderId);

  // Log activity
  await supabase.from('order_activity').insert({
    order_id: orderId,
    user_id: user.id,
    actor_type: 'customer',
    action: 'MODIFICATION_REQUESTED',
    description: `Customer requested modification #${newModificationNumber}.`,
    metadata: { requestText }
  });

  revalidatePath(`/my-orders/${orderId}`);
  return { success: true };
}
