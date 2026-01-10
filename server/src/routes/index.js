import express from 'express';
const router = express.Router();

import authRoutes from './authRoutes.js';
import exerciseRoutes from './exerciseRoutes.js';
import workoutRoutes from './workoutRoutes.js';
import logRoutes from './logRoutes.js';
import progressRoutes from './progressRoutes.js';
import userRoutes from './userRoutes.js';

// Utilisation des routes
router.use('/auth', authRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/workouts', workoutRoutes);
router.use('/logs', logRoutes);
router.use('/progress', progressRoutes);
router.use('/users', userRoutes);

export default router;