import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard/stats', protect, adminOnly, getDashboardStats);

export default router;
