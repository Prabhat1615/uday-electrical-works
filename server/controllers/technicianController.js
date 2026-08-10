import User from '../models/User.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import { createNotification } from '../utils/notificationHelper.js';
import { getIO } from '../services/socketService.js';
import { sendTechnicianApplicationReceivedEmail } from '../services/emailService.js';

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

// @desc    Submit a technician application (public onboarding)
// @route   POST /api/technician/apply
// @access  Public (rate-limited)
// The backend ALWAYS forces role = Technician and status = Pending.
// Role/status values sent by the frontend are ignored — privilege
// escalation via the request body is impossible.
export const applyAsTechnician = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      password,
      confirmPassword,
      skills,
      specialization,
      experience,
      additionalInfo
    } = req.body;

    // ---- Backend validation (frontend validation is never the boundary) ----
    if (!name || typeof name !== 'string' || !name.trim()) {
      return next(new ApiError(400, 'Full name is required'));
    }
    if (name.trim().length > 100) {
      return next(new ApiError(400, 'Full name must be 100 characters or fewer'));
    }

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return next(new ApiError(400, 'Please provide a valid email address'));
    }
    if (email.trim().length > 100) {
      return next(new ApiError(400, 'Email must be 100 characters or fewer'));
    }

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return next(new ApiError(400, 'Phone number is required'));
    }
    if (phone.trim().length > 20) {
      return next(new ApiError(400, 'Phone number must be 20 characters or fewer'));
    }

    if (!address || typeof address !== 'string' || !address.trim()) {
      return next(new ApiError(400, 'Address is required'));
    }
    if (address.trim().length > 300) {
      return next(new ApiError(400, 'Address must be 300 characters or fewer'));
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return next(new ApiError(400, 'Password must be at least 6 characters'));
    }
    if (password.length > 100) {
      return next(new ApiError(400, 'Password must be 100 characters or fewer'));
    }
    if (!confirmPassword || confirmPassword !== password) {
      return next(new ApiError(400, 'Passwords do not match'));
    }

    if (skills && skills.trim().length > 500) {
      return next(new ApiError(400, 'Skills must be 500 characters or fewer'));
    }
    if (specialization && specialization.trim().length > 200) {
      return next(new ApiError(400, 'Specialization must be 200 characters or fewer'));
    }
    if (experience && experience.trim().length > 500) {
      return next(new ApiError(400, 'Experience must be 500 characters or fewer'));
    }
    if (additionalInfo && additionalInfo.trim().length > 1000) {
      return next(new ApiError(400, 'Additional information must be 1000 characters or fewer'));
    }

    // ---- Duplicate account / application checks ----
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      // An approved technician account already exists for this email.
      if (existing.role === 'Technician' && existing.status === 'Approved') {
        return next(
          new ApiError(400, 'A technician account already exists with this email address')
        );
      }
      // A pending application already exists for this email.
      if (existing.role === 'Technician' && existing.status === 'Pending') {
        return next(
          new ApiError(400, 'You already have a technician application under review')
        );
      }
      // Intentional re-application after rejection: reuse the existing account,
      // update the professional information and reset to Pending. The password
      // is never changed here. History is preserved for audit purposes.
      if (existing.role === 'Technician' && existing.status === 'Rejected') {
        existing.name = name.trim();
        existing.phone = phone.trim();
        existing.address = address.trim();
        existing.skills = (skills || '').trim();
        existing.specialization = (specialization || '').trim();
        existing.experience = (experience || '').trim();
        existing.additionalInfo = (additionalInfo || '').trim();
        existing.status = 'Pending';
        existing.submittedAt = new Date();
        existing.approvedBy = null;
        existing.approvedAt = null;
        existing.rejectedBy = null;
        existing.rejectedAt = null;
        existing.rejectionReason = '';
        existing.applicationHistory.push({ event: 'Submitted' });
        await existing.save();

        await sendTechnicianApplicationReceivedEmail(existing.email, existing.name);
        await notifyAdminsOfApplication(existing.name);

        return res.status(201).json(
          new ApiResponse(
            201,
            { _id: existing._id, name: existing.name, email: existing.email, status: existing.status },
            'Application submitted successfully. Your application is awaiting Admin approval.'
          )
        );
      }
      // Any other existing account (Customer, Staff, Admin) with this email.
      return next(
        new ApiError(
          400,
          'An account already exists with this email address. Please use a different email or contact the administrator.'
        )
      );
    }

    // ---- Create the application ----
    // role and status are forced server-side. Any role/status in the request
    // body is ignored (never trusted from the client).
    const application = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'Technician',
      status: 'Pending',
      phone: phone.trim(),
      address: address.trim(),
      skills: (skills || '').trim(),
      specialization: (specialization || '').trim(),
      experience: (experience || '').trim(),
      additionalInfo: (additionalInfo || '').trim(),
      submittedAt: new Date(),
      applicationHistory: [{ event: 'Submitted' }]
    });

    await sendTechnicianApplicationReceivedEmail(application.email, application.name);
    await notifyAdminsOfApplication(application.name);

    // No token is issued — a Pending applicant is not authorized yet.
    res.status(201).json(
      new ApiResponse(
        201,
        { _id: application._id, name: application.name, email: application.email, status: application.status },
        'Application submitted successfully. Your application is awaiting Admin approval.'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get technician application status for a submitted email
// @route   POST /api/technician/application/status
// @access  Public (only reveals the status of the applicant's own email)
export const getApplicationStatus = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return next(new ApiError(400, 'Please provide a valid email address'));
    }

    const application = await User.findOne({
      email: email.trim().toLowerCase(),
      role: 'Technician'
    }).select('name email status rejectionReason submittedAt');

    if (!application) {
      return next(new ApiError(404, 'No technician application found for this email'));
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          name: application.name,
          email: application.email,
          status: application.status,
          rejectionReason: application.status === 'Rejected' ? application.rejectionReason : undefined,
          submittedAt: application.submittedAt || application.createdAt
        },
        'Application status retrieved'
      )
    );
  } catch (error) {
    next(error);
  }
};

// Notify every Admin account (in-app notification + socket signal).
// Private applicant information is only stored in the Admin's own
// notification record — it is never broadcast to other rooms/clients.
const notifyAdminsOfApplication = async (applicantName) => {
  try {
    const admins = await User.find({ role: 'Admin' }).select('_id');

    for (const admin of admins) {
      await createNotification({
        userId: admin._id,
        title: 'New technician application',
        message: `New technician application received from ${applicantName}.`,
        type: 'Service'
      });
      getIO().to(`user:${admin._id}`).emit('technician_requests_updated');
    }
  } catch (error) {
    console.error('Failed to notify admins of technician application:', error.message);
  }
};
