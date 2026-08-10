import User from '../models/User.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import { generateToken } from '../utils/generateToken.js';
import { isTechnicianAuthorized, getTechnicianAuthorizationMessage } from '../utils/technicianStatus.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (Customer role only — Admin/Staff/Technician accounts are
//          created by an Admin via POST /api/users)
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return next(new ApiError(400, 'User already exists with this email address'));
    }

    // Public registration is always a Customer.
    // Privileged roles are enforced server-side and cannot be self-assigned.
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'Customer',
      phone: phone || '',
      address: address || ''
    });

    const token = generateToken(user);

    res.status(201).json(
      new ApiResponse(
        201,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          phone: user.phone,
          address: user.address,
          token
        },
        'User registered successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, 'Please provide email and password'));
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return next(new ApiError(401, 'Invalid email or password'));
    }

    // Technician accounts can only access the portal after Admin approval.
    // Fail-closed: only explicitly Approved technicians (or legacy
    // Admin-created records — see utils/technicianStatus.js) may sign in.
    // This is enforced by the backend — never by the frontend alone.
    if (user.role === 'Technician' && !isTechnicianAuthorized(user)) {
      return next(new ApiError(403, getTechnicianAuthorizationMessage(user)));
    }

    const token = generateToken(user);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          phone: user.phone,
          address: user.address,
          token
        },
        'User logged in successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }
    res.status(200).json(new ApiResponse(200, user, 'Profile retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    const token = generateToken(updatedUser);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          status: updatedUser.status,
          phone: updatedUser.phone,
          address: updatedUser.address,
          token
        },
        'Profile updated successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};
