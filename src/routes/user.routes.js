import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticate, authorize(['admin']), getAllUsers);

// Get user by ID
router.get('/:id', authenticate, getUserById);

// Update user by ID
router.put('/:id', authenticate, updateUser);

// Delete user (Admin only)
router.delete('/:id', authenticate, authorize(['admin']), deleteUser);



export { router };