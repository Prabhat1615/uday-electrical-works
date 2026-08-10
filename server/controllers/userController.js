import User from '../models/User.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin/Staff
export const getUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    let query = {};

    if (role) {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, users, 'Users retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new user (Staff / Technician / Customer)
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    if (!name || !email || !password) {
      return next(new ApiError(400, 'Please provide name, email and password'));
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return next(new ApiError(400, 'User already exists with this email address'));
    }

    const assignedRole = ['Admin', 'Staff', 'Technician', 'Customer'].includes(role)
      ? role
      : 'Staff';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole,
      phone: phone || '',
      address: address || ''
    });

    res.status(201).json(new ApiResponse(201, user, 'User created successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role & details
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { role, name, phone, address } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    if (role) user.role = role;
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    await user.save();
    res.status(200).json(new ApiResponse(200, user, 'User updated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    await user.deleteOne();
    res.status(200).json(new ApiResponse(200, {}, 'User deleted successfully'));
  } catch (error) {
    next(error);
  }
};
