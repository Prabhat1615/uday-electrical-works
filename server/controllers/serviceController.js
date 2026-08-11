import Service from '../models/Service.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';

const DEFAULT_SERVICES = [
  {
    title: 'Wiring / Electrical Fault',
    category: 'House Wiring Repair',
    description: 'Tripping MCB, power loss in a room, loose connections, earthing faults and house wiring repairs.',
    estimatedDuration: '2-4 Hours',
    estimatedPrice: 500,
    status: 'Active'
  },
  {
    title: 'Fan Repair',
    category: 'Fan Repair',
    description: 'Ceiling, wall or table fan not running, noisy, slow speed or not rotating, diagnosis, repair and servicing at home.',
    estimatedDuration: '1-2 Hours',
    estimatedPrice: 250,
    status: 'Active'
  },
  {
    title: 'Fan Installation',
    category: 'Fan Installation',
    description: 'New ceiling or wall fan installation, including bracket mounting, wiring and test run.',
    estimatedDuration: '1-2 Hours',
    estimatedPrice: 400,
    status: 'Active'
  },
  {
    title: 'Exhaust Fan Installation',
    category: 'Exhaust Fan Repair',
    description: 'Kitchen or bathroom exhaust fan installation with proper duct and electrical connection.',
    estimatedDuration: '1-2 Hours',
    estimatedPrice: 450,
    status: 'Active'
  },
  {
    title: 'Switch / Socket Repair',
    category: 'Switch Repair',
    description: 'Sparking, loose or dead switch/socket repair or replacement with genuine brand modules.',
    estimatedDuration: '1 Hour',
    estimatedPrice: 200,
    status: 'Active'
  },
  {
    title: 'Light Installation',
    category: 'LED Light Installation',
    description: 'Ceiling light, LED battens, tube light and pendant light installation with fitting and wiring.',
    estimatedDuration: '1-2 Hours',
    estimatedPrice: 350,
    status: 'Active'
  },
  {
    title: 'LED / Lighting Repair',
    category: 'LED Light Installation',
    description: 'Tubelight chok or starter not working, LED flickering or not glowing, on-site repair.',
    estimatedDuration: '1 Hour',
    estimatedPrice: 200,
    status: 'Active'
  },
  {
    title: 'MCB / Distribution Board Service',
    category: 'MCB Replacement',
    description: 'MCB or distribution board replacement, circuit balancing and safety inspection.',
    estimatedDuration: '1-2 Hours',
    estimatedPrice: 400,
    status: 'Active'
  },
  {
    title: 'Appliance Electrical Repair',
    category: 'Appliance Repair Services',
    description: 'Geyser, cooler, mixer, iron, kettle and water pump electrical repair at your doorstep.',
    estimatedDuration: '1-2 Hours',
    estimatedPrice: 300,
    status: 'Active'
  },
  {
    title: 'General Electrical Service',
    category: 'Home Electrical Inspection',
    description: 'Complete home electrical safety check, wiring, switches, sockets, earthing and load check.',
    estimatedDuration: '2-3 Hours',
    estimatedPrice: 450,
    status: 'Active'
  }
];

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

    let services = await Service.find(query).sort({ createdAt: -1 });

    // If database service catalog is empty, auto-seed default services
    if (services.length === 0 && !category && !search) {
      const count = await Service.countDocuments();
      if (count === 0) {
        console.log('⚡ Auto-seeding initial service catalog for empty database...');
        await Service.insertMany(DEFAULT_SERVICES);
        services = await Service.find(query).sort({ createdAt: -1 });
      }
    }

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
