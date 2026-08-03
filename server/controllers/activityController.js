import ActivityLog from '../models/ActivityLog.js';
import ApiResponse from '../utils/apiResponse.js';

// @desc    Get activity logs
// @route   GET /api/activity
// @access  Private (Admin, Staff)
export const getActivityLogs = async (req, res, next) => {
  try {
    const { action } = req.query;
    let query = {};
    if (action) query.action = action;

    const logs = await ActivityLog.find(query)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json(new ApiResponse(200, logs, 'Activity logs retrieved'));
  } catch (error) {
    next(error);
  }
};
