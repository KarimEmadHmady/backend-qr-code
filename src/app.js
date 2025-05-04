import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { router as mealRoutes } from './routes/meals.routes.js';
import { router as authRoutes } from './routes/auth.routes.js';
import { router as userRoutes } from './routes/user.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectDB } from './config/db.js';

const app = express();

dotenv.config();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/meals', mealRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error Handler
app.use(errorHandler);

export default app;
