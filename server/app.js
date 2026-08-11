import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import technicianRoutes from './routes/technicianRoutes.js';
import adminTechnicianRoutes from './routes/adminTechnicianRoutes.js';
import productRoutes from './routes/productRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import userRoutes from './routes/userRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import backupRoutes from './routes/backupRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import amcRoutes from './routes/amcRoutes.js';
import warehouseRoutes from './routes/warehouseRoutes.js';
import fieldServiceRoutes from './routes/fieldServiceRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

import branchRoutes from './routes/branchRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

import { corsOptions } from './config/cors.js';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS Preflight and CORS headers BEFORE rate limiters
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Security Hardening
app.use(helmet({ contentSecurityPolicy: false }));

// Rate Limiters (configured to skip preflight OPTIONS requests)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  skip: (req) => req.method === 'OPTIONS',
  message: { success: false, message: 'Too many API requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// Stricter limiter for authentication endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: (req) => req.method === 'OPTIONS',
  message: { success: false, message: 'Too many login attempts, please try again later.' }
});
app.use('/api/auth/', authLimiter);

// Stricter limiter for public technician application endpoint
const technicianLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  skip: (req) => req.method === 'OPTIONS',
  message: { success: false, message: 'Too many technician application attempts, please try again later.' }
});
app.use('/api/technician/', technicianLimiter);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/technician', technicianRoutes);
app.use('/api/admin/technician-requests', adminTechnicianRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/backup', backupRoutes);

app.use('/api/payments', paymentRoutes);
app.use('/api/amc', amcRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/field-service', fieldServiceRoutes);
app.use('/api/reviews', reviewRoutes);

app.use('/api/branches', branchRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/health', healthRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`
  });
});

app.use(errorHandler);

export default app;
