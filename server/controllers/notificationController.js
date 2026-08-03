import Notification from '../models/Notification.js';
import ApiResponse from '../utils/apiResponse.js';

// @desc    Get current user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false
    });

    res.status(200).json(new ApiResponse(200, { notifications, unreadCount }, 'Notifications retrieved'));
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json(new ApiResponse(200, {}, 'Marked notification as read'));
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id }, { isRead: true });
    res.status(200).json(new ApiResponse(200, {}, 'All notifications marked as read'));
  } catch (error) {
    next(error);
  }
};
