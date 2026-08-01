import express from 'express';
import {
  createTicket,
  getMyTickets,
  getTicketById,
  updateTicket,
  deleteTicket
} from '../controllers/ticketController.js';
import { protect, requireUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', requireUser, createTicket);
router.get('/my-tickets', requireUser, getMyTickets);
router.get('/:id', getTicketById);
router.patch('/:id', requireUser, updateTicket);
router.delete('/:id', requireUser, deleteTicket);

export default router;
