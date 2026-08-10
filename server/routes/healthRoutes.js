import express from 'express';
import mongoose from 'mongoose';
import { getSystemHealthMetrics } from '../controllers/healthController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public health check (used by hosting platforms). Returns 200 when the
// process is alive; database state is reported in the payload without
// exposing any connection details or secrets.
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'Uday Electrical Works Enterprise Platform',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Admin-only detailed system metrics
router.get('/metrics', protect, authorize('Admin'), getSystemHealthMetrics);

export default router;
