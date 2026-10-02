import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Public order creation (or authenticated)
router.post(
  '/',
  (req, res, next) => {
    if (req.headers.authorization) {
      protect(req, res, next);
    } else {
      next();
    }
  },
  (req, res) => {
    createOrder(req, res);
  }
);

router.get('/', protect, (req, res) => {
  getOrders(req, res);
});

router.get('/:id', protect, (req, res) => {
  getOrderById(req, res);
});

router.put('/:id/status', protect, adminOnly, (req, res) => {
  updateOrderStatus(req, res);
});

export default router;
