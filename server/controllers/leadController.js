import Lead from '../models/Lead.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import { createNotification } from '../utils/notificationHelper.js';

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private (Admin, Staff)
export const getLeads = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { serviceRequired: { $regex: search, $options: 'i' } }
      ];
    }

    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, leads, 'Leads retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Create lead
// @route   POST /api/leads
// @access  Private/Public
export const createLead = async (req, res, next) => {
  try {
    const { name, phone, email, address, serviceRequired, notes, assignedTo } = req.body;

    const lead = await Lead.create({
      name,
      phone,
      email: email || '',
      address: address || '',
      serviceRequired,
      notes: notes || '',
      assignedTo: assignedTo || null,
      status: 'New'
    });

    if (assignedTo) {
      await createNotification({
        userId: assignedTo,
        title: 'New Lead Assignment',
        message: `Lead '${lead.name}' interested in ${lead.serviceRequired} has been assigned to you.`,
        type: 'Lead'
      });
    }

    res.status(201).json(new ApiResponse(201, lead, 'Lead created successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead status & assignment
// @route   PUT /api/leads/:id
// @access  Private (Admin, Staff)
export const updateLead = async (req, res, next) => {
  try {
    const { status, assignedTo, notes } = req.body;
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return next(new ApiError(404, 'Lead not found'));
    }

    const previousAssigned = lead.assignedTo?.toString();

    if (status) lead.status = status;
    if (assignedTo !== undefined) lead.assignedTo = assignedTo || null;
    if (notes !== undefined) lead.notes = notes;

    await lead.save();

    if (assignedTo && assignedTo.toString() !== previousAssigned) {
      await createNotification({
        userId: assignedTo,
        title: 'Lead Re-assigned',
        message: `Lead '${lead.name}' has been assigned to your sales pipeline.`,
        type: 'Lead'
      });
    }

    const updatedLead = await Lead.findById(lead._id).populate('assignedTo', 'name email phone');
    res.status(200).json(new ApiResponse(200, updatedLead, 'Lead updated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin)
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return next(new ApiError(404, 'Lead not found'));
    }

    await lead.deleteOne();
    res.status(200).json(new ApiResponse(200, {}, 'Lead deleted successfully'));
  } catch (error) {
    next(error);
  }
};
