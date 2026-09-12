export interface NotificationPayload {
  message: string;
  type: 'info' | 'warning' | 'critical';
  recipient?: string;
}

class SlackProvider {
  async send(payload: NotificationPayload) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
        console.warn('Slack webhook URL not configured.');
        return;
    }

    const emoji = payload.type === 'critical' ? '🚨' : payload.type === 'warning' ? '⚠️' : 'ℹ️';
    
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `${emoji} *${payload.type.toUpperCase()}*\n${payload.message}`
        })
      });
    } catch (e) {
      console.error('SlackProvider failed:', e);
    }
  }
}

class WhatsAppProvider {
  async send(payload: NotificationPayload) {
    const apiKey = process.env.WHATSAPP_API_KEY;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    if (!apiKey || !phoneId || !payload.recipient) {
      console.warn('WhatsApp not fully configured or missing recipient.');
      return;
    }
    
    try {
      // Stub for official WhatsApp Business API
      await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: payload.recipient,
          type: 'text',
          text: { body: payload.message }
        })
      });
    } catch (e) {
       console.error('WhatsAppProvider failed:', e);
    }
  }
}

export const notifications = {
  slack: new SlackProvider(),
  whatsapp: new WhatsAppProvider(),
  
  async alertAdmin(message: string, type: 'info' | 'warning' | 'critical' = 'info') {
    await this.slack.send({ message, type });
  },

  async notifyCustomer(phone: string, message: string) {
    await this.whatsapp.send({ message, type: 'info', recipient: phone });
  }
};
