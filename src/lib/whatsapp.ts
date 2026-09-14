export async function sendWhatsAppNotification(type: 'customer' | 'admin', orderData: any) {
    try {
        const token = process.env.WHATSAPP_API_TOKEN;
        const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;
        const phoneId = process.env.WHATSAPP_PHONE_ID || 'dummy_id';

        if (!token) {
            console.log(`[WhatsApp Simulation] No API token. Would send ${type} notification for order ${orderData.order_number}`);
            return;
        }

        const url = `https://graph.facebook.com/v17.0/${phoneId}/messages`;
        
        let to = '';
        let message = '';

        if (type === 'customer') {
            to = orderData.customer_phone;
            message = `Hi ${orderData.customer_name},\n\nYour order ${orderData.order_number} has been received successfully!\n\nTotal: ₹${orderData.total_amount}\nStatus: ${orderData.status}\n\nThank you for shopping with HoneyBee Learning!`;
        } else {
            to = adminNumber || '';
            message = `🚨 New Order Alert!\n\nOrder: ${orderData.order_number}\nCustomer: ${orderData.customer_name}\nPhone: ${orderData.customer_phone}\nTotal: ₹${orderData.total_amount}\n\nPlease check the admin panel for details.`;
        }

        if (!to) {
            console.warn(`[WhatsApp] No recipient number for ${type} notification.`);
            return;
        }

        const payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: to,
            type: "text",
            text: { body: message }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.json();
            console.error(`[WhatsApp] Failed to send ${type} notification:`, err);
        } else {
            console.log(`[WhatsApp] Successfully sent ${type} notification for order ${orderData.order_number}`);
        }
    } catch (error) {
        console.error(`[WhatsApp] Error in sending ${type} notification:`, error);
        // We intentionally don't throw to prevent breaking the order flow!
    }
}
