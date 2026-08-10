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
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized, no bearer token provided'));
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new ApiError(401, 'User associated with this token no longer exists.'));
    }

    req.user = user;
    next();
  } catch (error) {
    // Only token problems are 401. Database/server failures (e.g. MongoDB
    // unreachable) must surface as 500 so the frontend can distinguish
    // "session expired" from "server/database problem".
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, 'Not authorized, token failed'));
    }
    return next(error);
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
