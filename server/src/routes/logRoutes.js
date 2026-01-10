import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getMyLogs,
  getLogById,
  createLog,
  updateLog,
  deleteLog,
  getMyStats
} from '../controllers/logController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: Gestion des séances d'entraînement
 */

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Récupérer toutes mes séances
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début (ISO 8601)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin (ISO 8601)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Nombre de résultats
 *     responses:
 *       200:
 *         description: Liste des séances
 *       401:
 *         description: Non authentifié
 */
router.get('/', [
  query('startDate').optional().isISO8601().withMessage('Format de date de début invalide (ISO 8601)'),
  query('endDate').optional().isISO8601().withMessage('Format de date de fin invalide (ISO 8601)'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('La limite doit être entre 1 et 100'),
  validate
], getMyLogs);

/**
 * @swagger
 * /api/logs/stats/me:
 *   get:
 *     summary: Récupérer mes statistiques
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalSeances:
 *                       type: integer
 *                     totalDuree:
 *                       type: integer
 *                     moyenneDuree:
 *                       type: integer
 *       401:
 *         description: Non authentifié
 */
router.get('/stats/me', getMyStats);

/**
 * @swagger
 * /api/logs/{id}:
 *   get:
 *     summary: Récupérer une séance par ID
 *     tags: [Logs]
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
 *         description: Détails de la séance
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Séance non trouvée
 */
router.get('/:id', [
  param('id').isMongoId().withMessage('ID de séance invalide'),
  validate
], getLogById);

/**
 * @swagger
 * /api/logs:
 *   post:
 *     summary: Enregistrer une nouvelle séance
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exercices
 *             properties:
 *               workoutId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-01-09T20:00:00.000Z
 *               duree:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 600
 *                 example: 60
 *               notes:
 *                 type: string
 *                 maxLength: 1000
 *                 example: Bonne séance, je me sentais en forme
 *               exercices:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - exerciceId
 *                     - series
 *                   properties:
 *                     exerciceId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     series:
 *                       type: array
 *                       minItems: 1
 *                       items:
 *                         type: object
 *                         required:
 *                           - reps
 *                         properties:
 *                           poids:
 *                             type: number
 *                             minimum: 0
 *                             maximum: 500
 *                             example: 80
 *                           reps:
 *                             type: integer
 *                             minimum: 1
 *                             maximum: 100
 *                             example: 10
 *     responses:
 *       201:
 *         description: Séance enregistrée
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 */
router.post('/', [
  body('workoutId').optional().isMongoId().withMessage('ID de programme invalide'),
  body('date').optional().isISO8601().withMessage('Format de date invalide (ISO 8601)'),
  body('duree').optional().isInt({ min: 1, max: 600 }).withMessage('La durée doit être entre 1 et 600 minutes'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Les notes ne peuvent pas dépasser 1000 caractères'),
  body('exercices').isArray({ min: 1 }).withMessage('Au moins un exercice est requis'),
  body('exercices.*.exerciceId').notEmpty().withMessage('L\'ID de l\'exercice est requis').isMongoId().withMessage('ID d\'exercice invalide'),
  body('exercices.*.series').isArray({ min: 1 }).withMessage('Au moins une série est requise'),
  body('exercices.*.series.*.poids').optional().isFloat({ min: 0, max: 500 }).withMessage('Le poids doit être entre 0 et 500 kg'),
  body('exercices.*.series.*.reps').isInt({ min: 1, max: 100 }).withMessage('Les répétitions doivent être entre 1 et 100'),
  validate
], createLog);

/**
 * @swagger
 * /api/logs/{id}:
 *   put:
 *     summary: Mettre à jour une séance
 *     tags: [Logs]
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
 *               duree:
 *                 type: integer
 *               notes:
 *                 type: string
 *               exercices:
 *                 type: array
 *     responses:
 *       200:
 *         description: Séance mise à jour
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Séance non trouvée
 */
router.put('/:id', [
  param('id').isMongoId().withMessage('ID de séance invalide'),
  body('duree').optional().isInt({ min: 1, max: 600 }).withMessage('La durée doit être entre 1 et 600 minutes'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Les notes ne peuvent pas dépasser 1000 caractères'),
  body('exercices').optional().isArray({ min: 1 }).withMessage('Au moins un exercice est requis'),
  validate
], updateLog);

/**
 * @swagger
 * /api/logs/{id}:
 *   delete:
 *     summary: Supprimer une séance
 *     tags: [Logs]
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
 *         description: Séance supprimée
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Séance non trouvée
 */
router.delete('/:id', [
  param('id').isMongoId().withMessage('ID de séance invalide'),
  validate
], deleteLog);

export default router;