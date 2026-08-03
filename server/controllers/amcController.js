import AMC from '../models/AMC.js';
import User from '../models/User.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';

const generateAMCNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `UEW-AMC-${dateStr}-${randomNum}`;
};

// @desc    Get all AMC contracts
// @route   GET /api/amc
// @access  Private
export const getAMCs = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'Customer') {
      query.customer = req.user._id;
    } else if (req.user.role === 'Technician') {
      query.technician = req.user._id;
    }

    const amcs = await AMC.find(query)
      .populate('customer', 'name email phone address')
      .populate('technician', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, amcs, 'AMC contracts retrieved'));
  } catch (error) {
    next(error);
  }
};

// @desc    Create AMC Contract
// @route   POST /api/amc
// @access  Private (Admin, Staff)
export const createAMC = async (req, res, next) => {
  try {
    const { customerId, serviceType, startDate, endDate, visitFrequency, totalAmount, technicianId } = req.body;

    const customer = await User.findById(customerId);
    if (!customer) {
      return next(new ApiError(404, 'Customer not found'));
    }

    const amc = await AMC.create({
      contractNumber: generateAMCNumber(),
      customer: customer._id,
      serviceType,
      startDate,
      endDate,
      visitFrequency: visitFrequency || 'Quarterly',
      totalAmount: Number(totalAmount),
      technician: technicianId || null,
      status: 'Active'
    });

    const populatedAMC = await AMC.findById(amc._id)
      .populate('customer', 'name email phone')
      .populate('technician', 'name phone');

    res.status(201).json(new ApiResponse(201, populatedAMC, 'Annual Maintenance Contract created'));
  } catch (error) {
    next(error);
  }
};

// @desc    Renew AMC Contract
// @route   PUT /api/amc/:id/renew
// @access  Private (Admin, Staff)
export const renewAMC = async (req, res, next) => {
  try {
    const amc = await AMC.findById(req.params.id);
    if (!amc) {
      return next(new ApiError(404, 'AMC contract not found'));
    }

    const oneYearLater = new Date(amc.endDate || Date.now());
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    amc.endDate = oneYearLater;
    amc.status = 'Renewed';
    await amc.save();

    res.status(200).json(new ApiResponse(200, amc, 'AMC Contract renewed for 1 year'));
  } catch (error) {
    next(error);
  }
};
