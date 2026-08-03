import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';

// Helper to generate unique booking number
const generateBookingNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `UEW-BK-${dateStr}-${randomNum}`;
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer, Staff, Admin)
export const createBooking = async (req, res, next) => {
  try {
    const { serviceId, address, preferredDate, notes } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return next(new ApiError(404, 'Selected electrical service does not exist'));
    }

    const booking = await Booking.create({
      bookingNumber: generateBookingNumber(),
      customer: req.user._id,
      service: service._id,
      address,
      preferredDate,
      notes: notes || '',
      totalCost: service.estimatedPrice,
      status: 'Pending'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('service', 'title category estimatedPrice estimatedDuration')
      .populate('customer', 'name email phone');

    res.status(201).json(new ApiResponse(201, populatedBooking, 'Booking created successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings (Role-filtered)
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req, res, next) => {
  try {
    let query = {};

    // Customer sees only own bookings
    if (req.user.role === 'Customer') {
      query.customer = req.user._id;
    } 
    // Technician sees only assigned bookings
    else if (req.user.role === 'Technician') {
      query.assignedTechnician = req.user._id;
    }
    // Staff & Admin see all bookings (optional status filter)
    if (req.query.status) {
      query.status = req.query.status;
    }

    const bookings = await Booking.find(query)
      .populate('service', 'title category estimatedPrice estimatedDuration')
      .populate('customer', 'name email phone address')
      .populate('assignedTechnician', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, bookings, 'Bookings retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service', 'title category estimatedPrice estimatedDuration imageUrl')
      .populate('customer', 'name email phone address')
      .populate('assignedTechnician', 'name email phone');

    if (!booking) {
      return next(new ApiError(404, 'Booking not found'));
    }

    // Auth check: Customer can only view own booking; Technician only assigned
    if (
      req.user.role === 'Customer' &&
      booking.customer._id.toString() !== req.user._id.toString()
    ) {
      return next(new ApiError(403, 'Access denied to this booking record'));
    }
    if (
      req.user.role === 'Technician' &&
      booking.assignedTechnician?._id.toString() !== req.user._id.toString()
    ) {
      return next(new ApiError(403, 'Access denied to unassigned technician booking'));
    }

    res.status(200).json(new ApiResponse(200, booking, 'Booking details fetched'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status / assign technician / totalCost
// @route   PUT /api/bookings/:id
// @access  Private (Admin, Staff, Technician)
export const updateBooking = async (req, res, next) => {
  try {
    const { status, assignedTechnician, totalCost, notes } = req.body;
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new ApiError(404, 'Booking not found'));
    }

    // Technicians can only update status & notes of their assigned bookings
    if (req.user.role === 'Technician') {
      if (booking.assignedTechnician?.toString() !== req.user._id.toString()) {
        return next(new ApiError(403, 'You can only update your assigned service jobs'));
      }
      if (status) booking.status = status;
      if (notes) booking.notes = notes;
    } else {
      // Admin & Staff can update status, assignedTechnician, totalCost, notes
      if (status) booking.status = status;
      if (assignedTechnician !== undefined) booking.assignedTechnician = assignedTechnician || null;
      if (totalCost !== undefined) booking.totalCost = totalCost;
      if (notes !== undefined) booking.notes = notes;
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('service', 'title category estimatedPrice estimatedDuration')
      .populate('customer', 'name email phone address')
      .populate('assignedTechnician', 'name email phone');

    res.status(200).json(new ApiResponse(200, updatedBooking, 'Booking updated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin/Staff)
export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return next(new ApiError(404, 'Booking not found'));
    }

    await booking.deleteOne();
    res.status(200).json(new ApiResponse(200, {}, 'Booking deleted successfully'));
  } catch (error) {
    next(error);
  }
};
