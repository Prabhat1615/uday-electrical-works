import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post('/register', validateRequest(['name', 'email', 'password']), registerUser);
router.post('/login', validateRequest(['email', 'password']), loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
