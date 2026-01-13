import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getAllExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise
} from '../controllers/exerciseController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Exercises
 *   description: Gestion des exercices personnels de l'utilisateur
 */

/**
 * @swagger
 * /api/exercises:
 *   get:
 *     summary: Récupérer tous les exercices de l'utilisateur connecté
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: groupeMusculaire
 *         schema:
 *           type: string
 *           enum: [Pectoraux, Dos, Jambes, Épaules, Biceps, Triceps, Abdominaux, Cardio]
 *         description: Filtrer par groupe musculaire
 *       - in: query
 *         name: difficulte
 *         schema:
 *           type: string
 *           enum: [Débutant, Intermédiaire, Avancé]
 *         description: Filtrer par difficulté
 *       - in: query
 *         name: categorie
 *         schema:
 *           type: string
 *           enum: [Force, Cardio, Flexibilité]
 *         description: Filtrer par catégorie
 *     responses:
 *       200:
 *         description: Liste des exercices de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 15
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439011
 *                       nom:
 *                         type: string
 *                         example: Développé couché
 *                       description:
 *                         type: string
 *                         example: Exercice de base pour les pectoraux
 *                       groupeMusculaire:
 *                         type: string
 *                         example: Pectoraux
 *                       categorie:
 *                         type: string
 *                         example: Force
 *                       difficulte:
 *                         type: string
 *                         example: Intermédiaire
 *                       imageUrl:
 *                         type: string
 *                         example: https://example.com/image.jpg
 *                       createdBy:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439011
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Non authentifié
 */
router.get('/', protect, [
  query('groupeMusculaire').optional().isIn(['Pectoraux', 'Dos', 'Jambes', 'Épaules', 'Biceps', 'Triceps', 'Abdominaux', 'Cardio']).withMessage('Groupe musculaire invalide'),
  query('difficulte').optional().isIn(['Débutant', 'Intermédiaire', 'Avancé']).withMessage('Difficulté invalide'),
  query('categorie').optional().isIn(['Force', 'Cardio', 'Flexibilité']).withMessage('Catégorie invalide'),
  validate
], getAllExercises);

/**
 * @swagger
 * /api/exercises/{id}:
 *   get:
 *     summary: Récupérer un exercice par ID
 *     description: Récupère les détails d'un exercice appartenant à l'utilisateur connecté
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB de l'exercice
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Détails de l'exercice
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     nom:
 *                       type: string
 *                       example: Développé couché
 *                     description:
 *                       type: string
 *                       example: Exercice de base pour les pectoraux
 *                     groupeMusculaire:
 *                       type: string
 *                       example: Pectoraux
 *                     categorie:
 *                       type: string
 *                       example: Force
 *                     difficulte:
 *                       type: string
 *                       example: Intermédiaire
 *                     imageUrl:
 *                       type: string
 *                       example: https://example.com/image.jpg
 *                     createdBy:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Exercice non trouvé ou n'appartient pas à l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Exercice non trouvé
 */
router.get('/:id', protect, [
  param('id').isMongoId().withMessage('ID d\'exercice invalide'),
  validate
], getExerciseById);

/**
 * @swagger
 * /api/exercises:
 *   post:
 *     summary: Créer un nouvel exercice
 *     description: Crée un exercice personnel pour l'utilisateur connecté
 *     tags: [Exercises]
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
 *               - groupeMusculaire
 *             properties:
 *               nom:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: Pompes diamant
 *                 description: Nom de l'exercice
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: Variante des pompes ciblant les triceps
 *                 description: Description détaillée de l'exercice
 *               groupeMusculaire:
 *                 type: string
 *                 enum: [Pectoraux, Dos, Jambes, Épaules, Biceps, Triceps, Abdominaux, Cardio]
 *                 example: Triceps
 *                 description: Groupe musculaire principal ciblé
 *               categorie:
 *                 type: string
 *                 enum: [Force, Cardio, Flexibilité]
 *                 example: Force
 *                 default: Force
 *                 description: Catégorie de l'exercice
 *               difficulte:
 *                 type: string
 *                 enum: [Débutant, Intermédiaire, Avancé]
 *                 example: Intermédiaire
 *                 default: Intermédiaire
 *                 description: Niveau de difficulté
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/pompes-diamant.jpg
 *                 description: URL de l'image de l'exercice
 *     responses:
 *       201:
 *         description: Exercice créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Exercice créé avec succès
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     nom:
 *                       type: string
 *                       example: Pompes diamant
 *                     description:
 *                       type: string
 *                       example: Variante des pompes ciblant les triceps
 *                     groupeMusculaire:
 *                       type: string
 *                       example: Triceps
 *                     categorie:
 *                       type: string
 *                       example: Force
 *                     difficulte:
 *                       type: string
 *                       example: Intermédiaire
 *                     imageUrl:
 *                       type: string
 *                       example: https://example.com/pompes-diamant.jpg
 *                     createdBy:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Erreur de validation
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *       401:
 *         description: Non authentifié
 */
router.post('/', protect, [
  body('nom').trim().notEmpty().withMessage('Le nom de l\'exercice est requis').isLength({ min: 3, max: 100 }).withMessage('Le nom doit contenir entre 3 et 100 caractères'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('La description ne peut pas dépasser 500 caractères'),
  body('groupeMusculaire').notEmpty().withMessage('Le groupe musculaire est requis').isIn(['Pectoraux', 'Dos', 'Jambes', 'Épaules', 'Biceps', 'Triceps', 'Abdominaux', 'Cardio']).withMessage('Groupe musculaire invalide'),
  body('categorie').optional().isIn(['Force', 'Cardio', 'Flexibilité']).withMessage('Catégorie invalide'),
  body('difficulte').optional().isIn(['Débutant', 'Intermédiaire', 'Avancé']).withMessage('Difficulté invalide'),
  body('imageUrl').optional().isURL().withMessage('URL d\'image invalide'),
  validate
], createExercise);

/**
 * @swagger
 * /api/exercises/{id}:
 *   put:
 *     summary: Mettre à jour un exercice
 *     description: Modifie un exercice appartenant à l'utilisateur connecté
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB de l'exercice
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: Pompes diamant modifiées
 *                 description: Nouveau nom de l'exercice
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: Variante avancée des pompes diamant
 *                 description: Nouvelle description
 *               groupeMusculaire:
 *                 type: string
 *                 enum: [Pectoraux, Dos, Jambes, Épaules, Biceps, Triceps, Abdominaux, Cardio]
 *                 example: Triceps
 *               categorie:
 *                 type: string
 *                 enum: [Force, Cardio, Flexibilité]
 *                 example: Force
 *               difficulte:
 *                 type: string
 *                 enum: [Débutant, Intermédiaire, Avancé]
 *                 example: Avancé
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/create-image.jpg
 *     responses:
 *       200:
 *         description: Exercice mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Exercice modifié avec succès
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     nom:
 *                       type: string
 *                       example: Pompes diamant modifiées
 *                     description:
 *                       type: string
 *                       example: Variante avancée des pompes diamant
 *                     groupeMusculaire:
 *                       type: string
 *                       example: Triceps
 *                     categorie:
 *                       type: string
 *                       example: Force
 *                     difficulte:
 *                       type: string
 *                       example: Avancé
 *                     imageUrl:
 *                       type: string
 *                       example: https://example.com/create-image.jpg
 *                     createdBy:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Exercice non trouvé ou n'appartient pas à l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Exercice non trouvé
 */
router.put('/:id', protect, [
  param('id').isMongoId().withMessage('ID d\'exercice invalide'),
  body('nom').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Le nom doit contenir entre 3 et 100 caractères'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('La description ne peut pas dépasser 500 caractères'),
  body('groupeMusculaire').optional().isIn(['Pectoraux', 'Dos', 'Jambes', 'Épaules', 'Biceps', 'Triceps', 'Abdominaux', 'Cardio']).withMessage('Groupe musculaire invalide'),
  body('categorie').optional().isIn(['Force', 'Cardio', 'Flexibilité']).withMessage('Catégorie invalide'),
  body('difficulte').optional().isIn(['Débutant', 'Intermédiaire', 'Avancé']).withMessage('Difficulté invalide'),
  validate
], updateExercise);

/**
 * @swagger
 * /api/exercises/{id}:
 *   delete:
 *     summary: Supprimer un exercice
 *     description: Supprime un exercice appartenant à l'utilisateur connecté
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB de l'exercice à supprimer
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Exercice supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Exercice supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Exercice non trouvé ou n'appartient pas à l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Exercice non trouvé
 */
router.delete('/:id', protect, [
  param('id').isMongoId().withMessage('ID d\'exercice invalide'),
  validate
], deleteExercise);

export default router;