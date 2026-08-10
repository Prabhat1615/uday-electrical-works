import User from '../models/User.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import { createNotification } from '../utils/notificationHelper.js';
import {
  sendTechnicianApplicationApprovedEmail,
  sendTechnicianApplicationRejectedEmail
} from '../services/emailService.js';

// @desc    List technician applications
// @route   GET /api/admin/technician-requests
// @access  Private/Admin
export const getTechnicianRequests = async (req, res, next) => {
  try {
    const { status } = req.query;

    const query = { role: 'Technician' };
    if (status && ['Pending', 'Approved', 'Rejected'].includes(status)) {
      query.status = status;
    }

    const applications = await User.find(query)
      .select('-password')
      .sort({ submittedAt: -1, createdAt: -1 });

    // Real pending count for the Management Portal badge — never hardcoded.
    const pendingCount = await User.countDocuments({
      role: 'Technician',
      status: 'Pending'
    });

    res.status(200).json(
      new ApiResponse(
        200,
        { applications, pendingCount },
        'Technician applications retrieved'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single technician application (full details)
// @route   GET /api/admin/technician-requests/:id
// @access  Private/Admin
export const getTechnicianRequestById = async (req, res, next) => {
  try {
    const application = await User.findById(req.params.id)
      .select('-password')
      .populate('approvedBy', 'name email')
      .populate('rejectedBy', 'name email')
      .populate('applicationHistory.by', 'name email');

    if (!application || application.role !== 'Technician') {
      return next(new ApiError(404, 'Technician application not found'));
    }

    res.status(200).json(
      new ApiResponse(200, application, 'Technician application details retrieved')
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a pending technician application
// @route   PATCH /api/admin/technician-requests/:id/approve
// @access  Private/Admin
export const approveTechnician = async (req, res, next) => {
  try {
    const application = await User.findById(req.params.id);

    if (!application || application.role !== 'Technician') {
      return next(new ApiError(404, 'Technician application not found'));
    }
    if (application.status !== 'Pending') {
      return next(new ApiError(400, 'Only pending technician applications can be approved'));
    }

    application.status = 'Approved';
    application.approvedBy = req.user._id;
    application.approvedAt = new Date();
    application.rejectedBy = null;
    application.rejectedAt = null;
    application.rejectionReason = '';
    application.applicationHistory.push({ event: 'Approved', by: req.user._id });

    await application.save();

    // Applicant confirmation (email + in-app notification).
    sendTechnicianApplicationApprovedEmail(application.email, application.name);
    await createNotification({
      userId: application._id,
      title: 'Technician application approved',
      message: 'Your technician application has been approved. You can now sign in to the Technician Portal.',
      type: 'Service'
    });

    const populated = await User.findById(application._id)
      .select('-password')
      .populate('approvedBy', 'name email');

    res.status(200).json(
      new ApiResponse(
        200,
        {
          _id: populated._id,
          name: populated.name,
          email: populated.email,
          status: populated.status,
          approvedBy: populated.approvedBy,
          approvedAt: populated.approvedAt
        },
        'Technician application approved. The technician can now sign in.'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a pending technician application
// @route   PATCH /api/admin/technician-requests/:id/reject
// @access  Private/Admin
export const rejectTechnician = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;

    if (!rejectionReason || typeof rejectionReason !== 'string' || !rejectionReason.trim()) {
      return next(new ApiError(400, 'A rejection reason is required'));
    }
    if (rejectionReason.trim().length > 500) {
      return next(new ApiError(400, 'Rejection reason must be 500 characters or fewer'));
    }

    const application = await User.findById(req.params.id);

    if (!application || application.role !== 'Technician') {
      return next(new ApiError(404, 'Technician application not found'));
    }
    if (application.status !== 'Pending') {
      return next(new ApiError(400, 'Only pending technician applications can be rejected'));
    }

    application.status = 'Rejected';
    application.rejectedBy = req.user._id;
    application.rejectedAt = new Date();
    application.rejectionReason = rejectionReason.trim();
    application.applicationHistory.push({
      event: 'Rejected',
      by: req.user._id,
      reason: rejectionReason.trim()
    });

    await application.save();

    // Applicant notification (the application is preserved for audit).
    sendTechnicianApplicationRejectedEmail(
      application.email,
      application.name,
      application.rejectionReason
    );
    await createNotification({
      userId: application._id,
      title: 'Technician application not approved',
      message: 'Your technician application was not approved.',
      type: 'Service'
    });

    const populated = await User.findById(application._id)
      .select('-password')
      .populate('rejectedBy', 'name email');

    res.status(200).json(
      new ApiResponse(
        200,
        {
          _id: populated._id,
          name: populated.name,
          email: populated.email,
          status: populated.status,
          rejectedBy: populated.rejectedBy,
          rejectedAt: populated.rejectedAt,
          rejectionReason: populated.rejectionReason
        },
        'Technician application rejected'
      )
    );
  } catch (error) {
    next(error);
  }
};
