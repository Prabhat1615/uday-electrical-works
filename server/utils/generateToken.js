import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );
};
