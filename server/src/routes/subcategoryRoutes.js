import { Router } from 'express';
import {
  getSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from '../controllers/subcategoryController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getSubcategories);
router.post('/', protect, adminOnly, createSubcategory);
router.put('/:id', protect, adminOnly, updateSubcategory);
router.delete('/:id', protect, adminOnly, deleteSubcategory);

export default router;
