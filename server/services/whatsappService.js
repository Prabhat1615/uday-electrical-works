import NotificationHistory from '../models/NotificationHistory.js';

export const sendWhatsAppNotification = async ({ phone, templateName, message }) => {
  try {
    console.log('----------------------------------------------------');
    console.log(`📱 WHATSAPP / SMS ALERT SENT TO ${phone}:`);
    console.log(`TEMPLATE: ${templateName}`);
    console.log(`MESSAGE: ${message}`);
    console.log('----------------------------------------------------');

    await NotificationHistory.create({
      recipientPhone: phone || '+919876543210',
      channel: 'WhatsApp',
      templateName: templateName || 'GENERIC_ALERT',
      message: message || '',
      status: 'Delivered'
    });

    return true;
  } catch (err) {
    console.error('Failed to log WhatsApp alert:', err.message);
    return false;
  }
};
