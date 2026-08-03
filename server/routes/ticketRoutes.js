import express from 'express';
import { getTickets, createTicket, replyTicket } from '../controllers/ticketController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTickets)
  .post(createTicket);

router.put('/:id/reply', replyTicket);

export default router;
