import Ticket from '../models/Ticket.js';
import User from '../models/User.js';

// @desc    Get Admin Dashboard Stats Summary
// @route   GET /api/admin/dashboard
export const getAdminDashboardStats = async (req, res, next) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'Open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'In Progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'Resolved' });
    const totalUsers = await User.countDocuments();

    const lowPriority = await Ticket.countDocuments({ priority: 'Low' });
    const mediumPriority = await Ticket.countDocuments({ priority: 'Medium' });
    const highPriority = await Ticket.countDocuments({ priority: 'High' });

    res.status(200).json({
      success: true,
      stats: {
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        totalUsers,
        priorityCounts: {
          Low: lowPriority,
          Medium: mediumPriority,
          High: highPriority
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tickets (Admin)
// @route   GET /api/admin/tickets
export const getAllTickets = async (req, res, next) => {
  try {
    const { status, priority, category, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'fullName email role')
      .populate('assignedTo', 'fullName email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket status (Admin)
// @route   PATCH /api/admin/tickets/:id/status
export const updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Open', 'In Progress', 'Resolved'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status value');
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    ticket.status = status;
    await ticket.save();

    const updated = await Ticket.findById(ticket._id)
      .populate('createdBy', 'fullName email')
      .populate('assignedTo', 'fullName email');

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      ticket: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket priority (Admin)
// @route   PATCH /api/admin/tickets/:id/priority
export const updateTicketPriority = async (req, res, next) => {
  try {
    const { priority } = req.body;
    if (!['Low', 'Medium', 'High'].includes(priority)) {
      res.status(400);
      throw new Error('Invalid priority value');
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    ticket.priority = priority;
    await ticket.save();

    const updated = await Ticket.findById(ticket._id)
      .populate('createdBy', 'fullName email')
      .populate('assignedTo', 'fullName email');

    res.status(200).json({
      success: true,
      message: `Priority updated to ${priority}`,
      ticket: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign ticket to staff/user (Admin)
// @route   PATCH /api/admin/tickets/:id/assign
export const assignTicket = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    ticket.assignedTo = assignedTo || null;
    await ticket.save();

    const updated = await Ticket.findById(ticket._id)
      .populate('createdBy', 'fullName email')
      .populate('assignedTo', 'fullName email');

    res.status(200).json({
      success: true,
      message: assignedTo ? 'Ticket assigned successfully' : 'Ticket unassigned',
      ticket: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete ticket (Admin override)
// @route   DELETE /api/admin/tickets/:id
export const deleteTicketAdmin = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    await ticket.updateOne({ deletedAt: new Date() });
    res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully by admin'
    });
  } catch (error) {
    next(error);
  }
};
