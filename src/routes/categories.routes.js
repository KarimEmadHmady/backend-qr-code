import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory, getCategoryById } from '../controllers/categories.controller.js';
import multer from '../utils/cloudinary.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all categories
router.get('/', getCategories);

// Get single category
router.get('/:id', getCategoryById);

// Create new category (admin only)
router.post('/', authenticate, authorize(['admin']), multer.single('image'), createCategory);

// Update category (admin only)
router.put('/:id', authenticate, authorize(['admin']), multer.single('image'), updateCategory);

// Delete category (admin only)
router.delete('/:id', authenticate, authorize(['admin']), deleteCategory);

export { router }; 