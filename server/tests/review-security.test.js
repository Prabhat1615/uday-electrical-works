// Security & integrity tests for the Service Feedback (Review) API.
//
// Run against a DEDICATED test database (uday_electrical_test) derived from
// MONGO_URI — the development/production data is never touched. The test
// database is dropped automatically after the suite finishes.
//
// Coverage:
//   1. Authentication is required on every endpoint
//   2. Only Customers can submit feedback (technicians get 403)
//   3. Pending (unapproved) technicians are denied access (fail-closed)
//   4. Customer identity is derived from the token, not the request body
//      (spoofed customerId / technicianId are ignored)
//   5. Feedback only after the service is Completed (400 otherwise)
//   6. Customers cannot review someone else's booking (403)
//   7. One review per booking (409 on duplicate, incl. DB-level unique index)
//   8. Rating must be a whole number 1–5 (400 otherwise)
//   9. Customers cannot list all feedback (Admin/Staff only → 403)
//  10. /mine returns only the authenticated customer's own reviews
//  11. Single-review ownership: other customers/technicians get 403
//  12. Technicians see only their own feedback (/technician/me, /:techId)
//  13. Booking-scoped lookup is restricted to owner, assigned tech, or manager
import 'dotenv/config';
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import dns from 'dns';
import http from 'http';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

// Use reliable public DNS for SRV lookups (matches config/db.js — required
// for Atlas SRV resolution in this environment).
dns.setServers(['8.8.8.8', '1.1.1.1']);

const TEST_DB = 'uday_electrical_test';

// Swap the database name inside MONGO_URI so tests never touch real data.
const testUri = (() => {
  const raw = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/uday_electrical_dev';
  try {
    const url = new URL(raw);
    if (url.protocol === 'mongodb:' || url.protocol === 'mongodb+srv:') {
      if (url.protocol === 'mongodb+srv:' && !url.pathname) {
        return `${raw.replace(/\/?$/, '')}/${TEST_DB}`;
      }
      url.pathname = `/${TEST_DB}`;
      return url.toString();
    }
  } catch {
    // fall through
  }
  return `mongodb://127.0.0.1:27017/${TEST_DB}`;
})();

let server;
let baseUrl;
let admin, customerA, customerB, techApproved, techPending, techOther;
let service;
let bookingCompletedA, bookingInProgressA, bookingCompletedB, bookingCompletedOtherTech;

const token = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

const api = async (method, path, { body, user } = {}) => {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(user ? { Authorization: `Bearer ${token(user)}` } : {})
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    // non-JSON responses (shouldn't happen) are read as text
  }
  return { status: res.status, body: json };
};

before(async () => {
  // 1. Dedicated test database
  await mongoose.connect(testUri, { serverSelectionTimeoutMS: 15000 });
  await Promise.all([
    User.deleteMany({}),
    Service.deleteMany({}),
    Booking.deleteMany({}),
    Review.deleteMany({})
  ]);

  // 2. Users
  admin = await User.create({ name: 'Test Admin', email: 'admin.test@example.com', password: 'test123456', role: 'Admin' });
  customerA = await User.create({ name: 'Customer A', email: 'a.test@example.com', password: 'test123456', role: 'Customer', phone: '9000000001' });
  customerB = await User.create({ name: 'Customer B', email: 'b.test@example.com', password: 'test123456', role: 'Customer', phone: '9000000002' });
  techApproved = await User.create({ name: 'Tech Approved', email: 'tech.approved@example.com', password: 'test123456', role: 'Technician', status: 'Approved', phone: '9000000003' });
  techPending = await User.create({ name: 'Tech Pending', email: 'tech.pending@example.com', password: 'test123456', role: 'Technician', status: 'Pending', phone: '9000000004' });
  techOther = await User.create({ name: 'Tech Other', email: 'tech.other@example.com', password: 'test123456', role: 'Technician', status: 'Approved', phone: '9000000005' });

  // 3. Catalog + bookings
  service = await Service.create({ title: 'Fan Repair Test', category: 'Fan Repair', description: 'test service', estimatedPrice: 250 });
  const mkBooking = async (customer, technician, status, n) =>
    Booking.create({
      bookingNumber: `TESTBK-${n}`,
      customer: customer._id,
      service: service._id,
      address: '1 Test Street',
      city: 'Pune',
      preferredDate: new Date('2026-01-15'),
      preferredTime: '09:00 AM - 12:00 PM',
      status,
      assignedTechnician: technician?._id ?? null
    });
  bookingCompletedA = await mkBooking(customerA, techApproved, 'Completed', '0001');
  bookingInProgressA = await mkBooking(customerA, techApproved, 'In Progress', '0002');
  bookingCompletedB = await mkBooking(customerB, techApproved, 'Completed', '0003');
  bookingCompletedOtherTech = await mkBooking(customerB, techOther, 'Completed', '0004');

  // 4. Boot the app on an ephemeral port
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) await new Promise((r) => server.close(r));
  try {
    await mongoose.connection.dropDatabase();
  } catch {
    // database may already be gone
  }
  await mongoose.disconnect();
});

// ---------------------------------------------------------------------------
// 1. Authentication required on every endpoint
// ---------------------------------------------------------------------------
test('POST /api/reviews without a token returns 401', async () => {
  const { status } = await api('POST', '/api/reviews', { body: { bookingId: bookingCompletedA._id, rating: 5 } });
  assert.equal(status, 401);
});

test('GET /api/reviews without a token returns 401', async () => {
  const { status } = await api('GET', '/api/reviews');
  assert.equal(status, 401);
});

test('GET /api/reviews/mine without a token returns 401', async () => {
  const { status } = await api('GET', '/api/reviews/mine');
  assert.equal(status, 401);
});

// ---------------------------------------------------------------------------
// 2. Role enforcement
// ---------------------------------------------------------------------------
test('Technicians cannot submit feedback (Customers only → 403)', async () => {
  const { status, body } = await api('POST', '/api/reviews', {
    body: { bookingId: bookingCompletedA._id, rating: 5 },
    user: techApproved
  });
  assert.equal(status, 403);
  assert.match(body?.message || '', /not authorized/i);
});

test('Pending (unapproved) technicians are denied access (fail-closed → 403)', async () => {
  const { status } = await api('GET', `/api/reviews/booking/${bookingCompletedA._id}`, { user: techPending });
  assert.equal(status, 403);
});

test('Customers cannot list all feedback (Admin/Staff only → 403)', async () => {
  const { status } = await api('GET', '/api/reviews', { user: customerA });
  assert.equal(status, 403);
});

// ---------------------------------------------------------------------------
// 4. Identity is token-derived — spoofed customerId/technicianId are ignored
// ---------------------------------------------------------------------------
test('Spoofed customerId / technicianId in the body are ignored (identity from token + booking)', async () => {
  const { status, body } = await api('POST', '/api/reviews', {
    body: {
      bookingId: bookingCompletedA._id,
      rating: 5,
      comment: 'Excellent work, very professional',
      customerId: customerB._id,       // attempt to attribute the review to someone else
      technician: techOther._id,       // attempt to attach a different technician
      status: 'Pending'                // attempt to bypass the completion gate
    },
    user: customerA
  });
  assert.equal(status, 201);
  assert.equal(String(body?.data?.customer?._id), String(customerA._id));
  assert.equal(String(body?.data?.technician?._id), String(techApproved._id));
  assert.equal(body?.data?.rating, 5);
});

// ---------------------------------------------------------------------------
// 7. One review per booking (controller check + unique index)
// ---------------------------------------------------------------------------
test('Duplicate review on the same booking returns 409', async () => {
  const { status } = await api('POST', '/api/reviews', {
    body: { bookingId: bookingCompletedA._id, rating: 4 },
    user: customerA
  });
  assert.equal(status, 409);
});

// ---------------------------------------------------------------------------
// 5. Completion gate
// ---------------------------------------------------------------------------
test('Feedback is rejected for a booking that is not Completed → 400', async () => {
  const { status } = await api('POST', '/api/reviews', {
    body: { bookingId: bookingInProgressA._id, rating: 5 },
    user: customerA
  });
  assert.equal(status, 400);
});

// ---------------------------------------------------------------------------
// 6. Ownership enforcement
// ---------------------------------------------------------------------------
test('A customer cannot review another customer’s booking → 403', async () => {
  const { status } = await api('POST', '/api/reviews', {
    body: { bookingId: bookingCompletedB._id, rating: 5 },
    user: customerA
  });
  assert.equal(status, 403);
});

// ---------------------------------------------------------------------------
// 8. Rating validation
// ---------------------------------------------------------------------------
test('Invalid ratings (0, 6, non-integer, missing) are rejected → 400', async () => {
  for (const rating of [0, 6, 2.5, 'abc', null, undefined]) {
    const { status } = await api('POST', '/api/reviews', {
      body: { bookingId: bookingCompletedB._id, rating },
      user: customerB
    });
    assert.equal(status, 400, `rating=${rating} should be rejected`);
  }
});

// ---------------------------------------------------------------------------
// 10. /mine returns only the caller's own reviews
// ---------------------------------------------------------------------------
test('GET /api/reviews/mine returns only the authenticated customer’s own reviews', async () => {
  const { status, body } = await api('GET', '/api/reviews/mine', { user: customerB });
  assert.equal(status, 200);
  assert.ok(Array.isArray(body?.data));
  assert.ok(body.data.every((r) => String(r.customer?._id) === String(customerB._id)));
});

// ---------------------------------------------------------------------------
// 11. Single-review ownership
// ---------------------------------------------------------------------------
test('A customer cannot view another customer’s review → 403; admin can → 200', async () => {
  // Give customer B a review of their own first.
  const created = await api('POST', '/api/reviews', {
    body: { bookingId: bookingCompletedB._id, rating: 4, comment: 'Good work' },
    user: customerB
  });
  assert.equal(created.status, 201);
  const reviewId = created.body.data._id;

  const asOtherCustomer = await api('GET', `/api/reviews/${reviewId}`, { user: customerA });
  assert.equal(asOtherCustomer.status, 403);

  const asAdmin = await api('GET', `/api/reviews/${reviewId}`, { user: admin });
  assert.equal(asAdmin.status, 200);
  assert.equal(String(asAdmin.body?.data?._id), String(reviewId));
});

// ---------------------------------------------------------------------------
// 12. Technician scoping
// ---------------------------------------------------------------------------
test('Technicians see only their own feedback', async () => {
  const mine = await api('GET', '/api/reviews/technician/me', { user: techApproved });
  assert.equal(mine.status, 200);
  assert.ok(mine.body.data.every((r) => String(r.technician?._id) === String(techApproved._id)));

  const otherTech = await api('GET', `/api/reviews/technician/${techOther._id}`, { user: techApproved });
  assert.equal(otherTech.status, 403);

  const otherTechByAdmin = await api('GET', `/api/reviews/technician/${techOther._id}`, { user: admin });
  assert.equal(otherTechByAdmin.status, 200);
});

// ---------------------------------------------------------------------------
// 13. Booking-scoped lookup restrictions
// ---------------------------------------------------------------------------
test('Booking-scoped feedback is restricted to owner, assigned technician or manager', async () => {
  // Customer B owns the booking assigned to techOther → 200
  const owner = await api('GET', `/api/reviews/booking/${bookingCompletedOtherTech._id}`, { user: customerB });
  assert.equal(owner.status, 200);
  // null (no review yet) is a valid 200 result
  assert.equal(owner.body?.data, null);

  // Customer A does not → 403
  const stranger = await api('GET', `/api/reviews/booking/${bookingCompletedOtherTech._id}`, { user: customerA });
  assert.equal(stranger.status, 403);

  // Assigned technician techOther → 200; unrelated techApproved → 403
  const assigned = await api('GET', `/api/reviews/booking/${bookingCompletedOtherTech._id}`, { user: techOther });
  assert.equal(assigned.status, 200);
  const unrelated = await api('GET', `/api/reviews/booking/${bookingCompletedOtherTech._id}`, { user: techApproved });
  assert.equal(unrelated.status, 403);

  // Manager → 200
  const manager = await api('GET', `/api/reviews/booking/${bookingCompletedOtherTech._id}`, { user: admin });
  assert.equal(manager.status, 200);
});

// ---------------------------------------------------------------------------
// 14. Full management list + analytics integration (Admin/Staff)
// ---------------------------------------------------------------------------
test('Admin can list all feedback and the analytics endpoint reports rating stats', async () => {
  const list = await api('GET', '/api/reviews', { user: admin });
  assert.equal(list.status, 200);
  assert.ok(Array.isArray(list.body?.data));
  assert.equal(list.body.data.length, 2);

  const analytics = await api('GET', '/api/reports/analytics', { user: admin });
  assert.equal(analytics.status, 200);
  assert.equal(analytics.body?.data?.cards?.reviewCount, 2);
  assert.equal(analytics.body?.data?.cards?.avgRating, 4.5);
  assert.equal(analytics.body?.data?.charts?.ratingDistribution?.star5, 1);
  assert.equal(analytics.body?.data?.charts?.ratingDistribution?.star4, 1);
});
