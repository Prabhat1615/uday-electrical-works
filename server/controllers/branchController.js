import Branch from '../models/Branch.js';
import ApiResponse from '../utils/apiResponse.js';

// @desc    Get all branches
// @route   GET /api/branches
// @access  Private
export const getBranches = async (req, res, next) => {
  try {
    const branches = await Branch.find().populate('manager', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, branches, 'Branch locations fetched successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Create branch
// @route   POST /api/branches
// @access  Private (Admin)
export const createBranch = async (req, res, next) => {
  try {
    const { name, code, address, managerId, phone, email } = req.body;
    const branch = await Branch.create({
      name,
      code,
      address,
      manager: managerId || null,
      phone,
      email
    });
    res.status(201).json(new ApiResponse(201, branch, 'Branch registered successfully'));
  } catch (error) {
    next(error);
  }
};
