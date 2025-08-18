import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, register } from '../controller/authController.js';
const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many requests!',
  standardHeaders: true,
  legacyHeaders: false,
});
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

export default router;
