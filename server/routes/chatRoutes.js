import express from 'express';
import {
  handleChatMessage,
  getChatHistory,
  clearChatHistory
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', handleChatMessage);
router.get('/history', getChatHistory);
router.delete('/history', clearChatHistory);

export default router;
