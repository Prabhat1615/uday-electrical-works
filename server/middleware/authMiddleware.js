import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';
import User from '../models/User.js';
import ApiError from '../utils/apiError.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, jwtConfig.secret);
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        throw new ApiError(401, 'User associated with this token no longer exists.');
      }
      
      req.user = user;
      next();
    } catch (error) {
      next(new ApiError(401, error.message || 'Not authorized, token failed'));
    }
  }

  if (!token) {
    next(new ApiError(401, 'Not authorized, no bearer token provided'));
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `User role '${req.user?.role || 'Guest'}' is not authorized to access this route`
        )
      );
    }
    next();
  };
};
