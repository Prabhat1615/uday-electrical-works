import express from 'express';
import {
  createUser,
  getUsers,
  updateUserRole,
  deleteUser
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('Admin', 'Staff'), getUsers);
router.post('/', authorize('Admin'), createUser);
router.put('/:id', authorize('Admin'), updateUserRole);
router.delete('/:id', authorize('Admin'), deleteUser);

export default router;
