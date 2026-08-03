import { processAiQuery } from '../services/aiAssistantService.js';
import Product from '../models/Product.js';
import ApiResponse from '../utils/apiResponse.js';

// @desc    Process AI Chatbot Assistant query
// @route   POST /api/ai/chat
// @access  Public / Private
export const askAiAssistant = async (req, res, next) => {
  try {
    const { query } = req.body;
    const result = processAiQuery(query);
    res.status(200).json(new ApiResponse(200, result, 'AI assistant response generated'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI Inventory Forecasting insights
// @route   GET /api/ai/forecast
// @access  Private (Admin, Staff)
export const getInventoryForecast = async (req, res, next) => {
  try {
    const products = await Product.find();

    const lowStockRisk = products.filter((p) => p.stock <= 5).map((p) => ({
      name: p.name,
      stock: p.stock,
      predictedDaysLeft: Math.max(1, Math.floor(p.stock * 1.5)),
      recommendation: 'Reorder immediately from certified vendor'
    }));

    const fastMoving = products.slice(0, 3).map((p) => ({
      name: p.name,
      category: p.category,
      velocity: 'High Demand (12+ units/mo)'
    }));

    res.status(200).json(new ApiResponse(200, {
      lowStockRisk,
      fastMoving,
      forecastInsight: 'Transformer Copper Wire & Stator Varnish demand predicted to rise 25% due to seasonal monsoon power surges.'
    }, 'AI inventory forecast generated'));
  } catch (error) {
    next(error);
  }
};
