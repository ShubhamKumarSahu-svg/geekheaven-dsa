import { Router } from 'express';
import { getQuestions } from '../controller/contentController.js';
const router = Router();

router.route('/').get(getQuestions);

export default router;
