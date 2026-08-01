import express from 'express';
import {
  getAdminDashboardStats,
  getAllTickets,
  getAllUsers,
  updateTicketStatus,
  updateTicketPriority,
  assignTicket,
  deleteTicketAdmin
} from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, requireAdmin);

router.get('/dashboard', getAdminDashboardStats);
router.get('/tickets', getAllTickets);
router.get('/users', getAllUsers);
router.patch('/tickets/:id/status', updateTicketStatus);
router.patch('/tickets/:id/priority', updateTicketPriority);
router.patch('/tickets/:id/assign', assignTicket);
router.delete('/tickets/:id', deleteTicketAdmin);

export default router;
