import Ticket from '../models/Ticket.js';

// @desc    Create a new ticket
// @route   POST /api/tickets
export const createTicket = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      res.status(400);
      throw new Error('Title and description are required');
    }

    const ticket = await Ticket.create({
      title,
      description,
      category: category || 'General Support',
      priority: priority || 'Medium',
      createdBy: req.user._id
    });

    const populatedTicket = await Ticket.findById(ticket._id).populate('createdBy', 'fullName email');

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      ticket: populatedTicket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tickets for logged-in user
// @route   GET /api/tickets/my-tickets
export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user._id })
      .populate('createdBy', 'fullName email')
      .populate('assignedTo', 'fullName email')
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

// @desc    Get ticket by ID
// @route   GET /api/tickets/:id
export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'fullName email')
      .populate('assignedTo', 'fullName email');

    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    if (ticket.createdBy._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this ticket');
    }

    res.status(200).json({
      success: true,
      ticket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket (Only if status is 'Open' for regular users)
// @route   PATCH /api/tickets/:id
export const updateTicket = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    if (ticket.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to modify this ticket');
    }

    if (req.user.role !== 'admin' && ticket.status !== 'Open') {
      res.status(400);
      throw new Error('Cannot edit tickets that are In Progress or Resolved');
    }

    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (category) ticket.category = category;
    if (priority) ticket.priority = priority;

    const updatedTicket = await ticket.save();
    const populated = await Ticket.findById(updatedTicket._id)
      .populate('createdBy', 'fullName email')
      .populate('assignedTo', 'fullName email');

    res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      ticket: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete ticket (Only if status is 'Open' for regular users)
// @route   DELETE /api/tickets/:id
export const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    if (ticket.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this ticket');
    }

    if (req.user.role !== 'admin' && ticket.status !== 'Open') {
      res.status(400);
      throw new Error('Cannot delete tickets that are In Progress or Resolved');
    }

    await ticket.updateOne({ deletedAt: new Date() });

    res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
