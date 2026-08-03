import ApiError from '../utils/apiError.js';

export const validateRequest = (requiredFields) => {
  return (req, res, next) => {
    const missing = [];
    requiredFields.forEach(field => {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    });

    if (missing.length > 0) {
      return next(new ApiError(400, `Missing required fields: ${missing.join(', ')}`));
    }
    next();
  };
};
