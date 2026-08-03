import Service from '../models/Service.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res, next) => {
  try {
    const { category, search, status } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }
    if (status) {
      query.status = status;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const services = await Service.find(query).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, services, 'Services retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return next(new ApiError(404, 'Service not found'));
    }
    res.status(200).json(new ApiResponse(200, service, 'Service retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin/Staff
export const createService = async (req, res, next) => {
  try {
    const { title, category, description, estimatedPrice, estimatedDuration, imageUrl } = req.body;

    const service = await Service.create({
      title,
      category,
      description,
      estimatedPrice,
      estimatedDuration,
      imageUrl: imageUrl || undefined
    });

    res.status(201).json(new ApiResponse(201, service, 'Service created successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin/Staff
export const updateService = async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);
    if (!service) {
      return next(new ApiError(404, 'Service not found'));
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json(new ApiResponse(200, service, 'Service updated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin/Staff
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return next(new ApiError(404, 'Service not found'));
    }

    await service.deleteOne();
    res.status(200).json(new ApiResponse(200, {}, 'Service deleted successfully'));
  } catch (error) {
    next(error);
  }
};
