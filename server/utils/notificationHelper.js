import Notification from '../models/Notification.js';

export const createNotification = async ({ userId, title, message, type }) => {
  try {
    if (!userId) return;
    await Notification.create({
      user: userId,
      title,
      message,
      type: type || 'General'
    });
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};
