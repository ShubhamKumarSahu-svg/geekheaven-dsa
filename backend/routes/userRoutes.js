import express from 'express';
import {
  getUserProfile,
  toggleBookmark,
  toggleProgress,
} from '../controller/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile').get(protect, getUserProfile);
router.route('/progress').post(protect, toggleProgress);
router.route('/bookmark').post(protect, toggleBookmark);

export default router;
