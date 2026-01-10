import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getMyProgress,
  addProgress,
  deleteProgress,
  getLatestProgress
} from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: Gestion de la progression (poids, mesures)
 */

/**
 * @swagger
 * /api/progress:
 *   get:
 *     summary: Récupérer toutes mes mesures
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin
 *     responses:
 *       200:
 *         description: Liste des mesures
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
router.get('/', [
  query('startDate').optional().isISO8601().withMessage('Format de date de début invalide (ISO 8601)'),
  query('endDate').optional().isISO8601().withMessage('Format de date de fin invalide (ISO 8601)'),
  validate
], getMyProgress);

/**
 * @swagger
 * /api/progress/latest:
 *   get:
 *     summary: Récupérer la dernière mesure
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dernière mesure récupérée
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Aucune mesure trouvée
 */
router.get('/latest', getLatestProgress);

/**
 * @swagger
 * /api/progress:
 *   post:
 *     summary: Ajouter une nouvelle mesure
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               poids:
 *                 type: number
 *                 minimum: 30
 *                 maximum: 300
 *                 example: 76.5
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-01-09T20:00:00.000Z
 *               mensurations:
 *                 type: object
 *                 properties:
 *                   tourTaille:
 *                     type: integer
 *                     minimum: 40
 *                     maximum: 200
 *                     example: 85
 *                   tourPoitrine:
 *                     type: integer
 *                     minimum: 50
 *                     maximum: 200
 *                     example: 100
 *                   tourBras:
 *                     type: integer
 *                     minimum: 15
 *                     maximum: 80
 *                     example: 35
 *                   tourCuisses:
 *                     type: integer
 *                     minimum: 30
 *                     maximum: 120
 *                     example: 60
 *     responses:
 *       201:
 *         description: Mesure ajoutée
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 */
router.post('/', [
  body('poids').optional().isFloat({ min: 30, max: 300 }).withMessage('Le poids doit être entre 30 et 300 kg'),
  body('date').optional().isISO8601().withMessage('Format de date invalide (ISO 8601)'),
  body('mensurations.tourTaille').optional().isInt({ min: 40, max: 200 }).withMessage('Tour de taille invalide (40-200 cm)'),
  body('mensurations.tourPoitrine').optional().isInt({ min: 50, max: 200 }).withMessage('Tour de poitrine invalide (50-200 cm)'),
  body('mensurations.tourBras').optional().isInt({ min: 15, max: 80 }).withMessage('Tour de bras invalide (15-80 cm)'),
  body('mensurations.tourCuisses').optional().isInt({ min: 30, max: 120 }).withMessage('Tour de cuisses invalide (30-120 cm)'),
  validate
], addProgress);

/**
 * @swagger
 * /api/progress/{id}:
 *   delete:
 *     summary: Supprimer une mesure
 *     tags: [Progress]
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
 *         description: Mesure supprimée
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Mesure non trouvée
 */
router.delete('/:id', [
  param('id').isMongoId().withMessage('ID de mesure invalide'),
  validate
], deleteProgress);

export default router;