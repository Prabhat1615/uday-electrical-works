import ActivityLog from '../models/ActivityLog.js';

export const logActivity = async ({ userId, action, entity, entityId, details }) => {
  try {
    await ActivityLog.create({
      user: userId || null,
      action,
      entity,
      entityId: entityId || '',
      details: details || ''
    });
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
};
