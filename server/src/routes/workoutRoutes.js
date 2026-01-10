import express from 'express';
import { body, param } from 'express-validator';
import {
  getMyWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout
} from '../controllers/workoutController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Workouts
 *   description: Gestion des programmes d'entraînement
 */

/**
 * @swagger
 * /api/workouts:
 *   get:
 *     summary: Récupérer tous mes programmes
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des programmes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *       401:
 *         description: Non authentifié
 */
router.get('/', getMyWorkouts);

/**
 * @swagger
 * /api/workouts/{id}:
 *   get:
 *     summary: Récupérer un programme par ID
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du programme
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Programme non trouvé
 */
router.get('/:id', [
  param('id').isMongoId().withMessage('ID de programme invalide'),
  validate
], getWorkoutById);

/**
 * @swagger
 * /api/workouts:
 *   post:
 *     summary: Créer un nouveau programme d'entraînement
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - exercices
 *             properties:
 *               nom:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: Push Day
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: Programme pectoraux, épaules et triceps
 *               exercices:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - exerciceId
 *                   properties:
 *                     exerciceId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     ordre:
 *                       type: integer
 *                       minimum: 0
 *                       example: 1
 *                     seriesCible:
 *                       type: integer
 *                       minimum: 1
 *                       maximum: 20
 *                       example: 4
 *                     repsCible:
 *                       type: integer
 *                       minimum: 1
 *                       maximum: 100
 *                       example: 10
 *                     tempsRepos:
 *                       type: integer
 *                       minimum: 0
 *                       maximum: 600
 *                       example: 90
 *     responses:
 *       201:
 *         description: Programme créé avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 */
router.post('/', [
  body('nom').trim().notEmpty().withMessage('Le nom du programme est requis').isLength({ min: 3, max: 100 }).withMessage('Le nom doit contenir entre 3 et 100 caractères'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('La description ne peut pas dépasser 500 caractères'),
  body('exercices').isArray({ min: 1 }).withMessage('Au moins un exercice est requis'),
  body('exercices.*.exerciceId').notEmpty().withMessage('L\'ID de l\'exercice est requis').isMongoId().withMessage('ID d\'exercice invalide'),
  body('exercices.*.ordre').optional().isInt({ min: 0 }).withMessage('L\'ordre doit être un nombre positif'),
  body('exercices.*.seriesCible').optional().isInt({ min: 1, max: 20 }).withMessage('Les séries cibles doivent être entre 1 et 20'),
  body('exercices.*.repsCible').optional().isInt({ min: 1, max: 100 }).withMessage('Les répétitions cibles doivent être entre 1 et 100'),
  body('exercices.*.tempsRepos').optional().isInt({ min: 0, max: 600 }).withMessage('Le temps de repos doit être entre 0 et 600 secondes'),
  validate
], createWorkout);

/**
 * @swagger
 * /api/workouts/{id}:
 *   put:
 *     summary: Mettre à jour un programme
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               exercices:
 *                 type: array
 *     responses:
 *       200:
 *         description: Programme mis à jour
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Programme non trouvé
 */
router.put('/:id', [
  param('id').isMongoId().withMessage('ID de programme invalide'),
  body('nom').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Le nom doit contenir entre 3 et 100 caractères'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('La description ne peut pas dépasser 500 caractères'),
  body('exercices').optional().isArray({ min: 1 }).withMessage('Au moins un exercice est requis'),
  body('exercices.*.exerciceId').optional().isMongoId().withMessage('ID d\'exercice invalide'),
  body('exercices.*.seriesCible').optional().isInt({ min: 1, max: 20 }).withMessage('Les séries cibles doivent être entre 1 et 20'),
  body('exercices.*.repsCible').optional().isInt({ min: 1, max: 100 }).withMessage('Les répétitions cibles doivent être entre 1 et 100'),
  validate
], updateWorkout);

/**
 * @swagger
 * /api/workouts/{id}:
 *   delete:
 *     summary: Supprimer un programme
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Programme supprimé
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Programme non trouvé
 */
router.delete('/:id', [
  param('id').isMongoId().withMessage('ID de programme invalide'),
  validate
], deleteWorkout);

export default router;