import SupportTicket from '../models/SupportTicket.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';

const generateTicketNumber = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `UEW-TKT-${randomNum}`;
};

// @desc    Get support tickets
// @route   GET /api/tickets
// @access  Private
export const getTickets = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'Customer') {
      query.customer = req.user._id;
    }

    const tickets = await SupportTicket.find(query)
      .populate('customer', 'name email phone')
      .populate('replies.sender', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, tickets, 'Support tickets retrieved'));
  } catch (error) {
    next(error);
  }
};

// @desc    Create support ticket
// @route   POST /api/tickets
// @access  Private
export const createTicket = async (req, res, next) => {
  try {
    const { subject, category, priority, description } = req.body;

    const ticket = await SupportTicket.create({
      ticketNumber: generateTicketNumber(),
      customer: req.user._id,
      subject,
      category: category || 'Electrical Repair',
      priority: priority || 'Medium',
      description,
      status: 'Open'
    });

    res.status(201).json(new ApiResponse(201, ticket, 'Support ticket created'));
  } catch (error) {
    next(error);
  }
};

// @desc    Add reply & update ticket status
// @route   PUT /api/tickets/:id/reply
// @access  Private
export const replyTicket = async (req, res, next) => {
  try {
    const { message, status } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return next(new ApiError(404, 'Ticket not found'));
    }

    if (message) {
      ticket.replies.push({
        sender: req.user._id,
        message,
        createdAt: new Date()
      });
    }

    if (status) {
      ticket.status = status;
    }

    await ticket.save();

    const updatedTicket = await SupportTicket.findById(ticket._id)
      .populate('customer', 'name email phone')
      .populate('replies.sender', 'name role');

    res.status(200).json(new ApiResponse(200, updatedTicket, 'Ticket updated with reply'));
  } catch (error) {
    next(error);
  }
};
