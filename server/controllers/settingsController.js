import CompanySettings from '../models/CompanySettings.js';
import ApiResponse from '../utils/apiResponse.js';

// @desc    Get company settings
// @route   GET /api/settings
// @access  Public / Private
export const getSettings = async (req, res, next) => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = await CompanySettings.create({});
    }
    res.status(200).json(new ApiResponse(200, settings, 'Settings fetched successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update company settings
// @route   PUT /api/settings
// @access  Private (Admin)
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = new CompanySettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    await settings.save();
    res.status(200).json(new ApiResponse(200, settings, 'Company settings updated successfully'));
  } catch (error) {
    next(error);
  }
};
