import Notification from '../models/Notification.js';
import { getIO } from '../services/socketService.js';

export const createNotification = async ({ userId, title, message, type }) => {
  try {
    if (!userId) return;
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type: type || 'General'
    });

    // Push real-time update to the recipient's Socket.IO room
    getIO().to(`user:${userId}`).emit('new_notification', notification);
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};
