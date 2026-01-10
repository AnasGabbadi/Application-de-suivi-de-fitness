import express from 'express';
import { body } from 'express-validator';
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getUserStats
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion du profil utilisateur
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Récupérer son profil
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré
 *       401:
 *         description: Non authentifié
 */
router.get('/profile', getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Mettre à jour son profil
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: GABBADI
 *               prenom:
 *                 type: string
 *                 example: Anas
 *               age:
 *                 type: integer
 *                 minimum: 13
 *                 maximum: 120
 *                 example: 23
 *               poids:
 *                 type: number
 *                 minimum: 30
 *                 maximum: 300
 *                 example: 78
 *               taille:
 *                 type: integer
 *                 minimum: 100
 *                 maximum: 250
 *                 example: 175
 *               objectif:
 *                 type: string
 *                 enum: [perte_poids, prise_masse, maintien, endurance]
 *                 example: maintien
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 */
router.put('/profile', [
  body('nom').optional().trim().isLength({ min: 2, max: 50 }),
  body('prenom').optional().trim().isLength({ min: 2, max: 50 }),
  body('age').optional().isInt({ min: 13, max: 120 }),
  body('poids').optional().isFloat({ min: 30, max: 300 }),
  body('taille').optional().isInt({ min: 100, max: 250 }),
  body('objectif').optional().isIn(['perte_poids', 'prise_masse', 'maintien', 'endurance']),
  validate
], updateProfile);

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Changer son mot de passe
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "newpass123"
 *     responses:
 *       200:
 *         description: Mot de passe changé avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Mot de passe actuel incorrect
 */
router.put('/change-password', [
  body('currentPassword').notEmpty().withMessage('Le mot de passe actuel est requis'),
  body('newPassword').notEmpty().withMessage('Le nouveau mot de passe est requis').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères').custom((value, { req }) => {
    if (value === req.body.currentPassword) {
      throw new Error('Le nouveau mot de passe doit être différent de l\'ancien');
    }
    return true;
  }),
  validate
], changePassword);

/**
 * @swagger
 * /api/users/account:
 *   delete:
 *     summary: Supprimer son compte
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Compte supprimé avec succès
 *       401:
 *         description: Mot de passe incorrect
 */
router.delete('/account', [
  body('password').notEmpty().withMessage('Le mot de passe est requis pour supprimer le compte'),
  validate
], deleteAccount);

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Obtenir ses statistiques globales
 *     tags: [Users]
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
 *                     user:
 *                       type: object
 *                     stats:
 *                       type: object
 *                       properties:
 *                         totalProgrammes:
 *                           type: integer
 *                         totalSeances:
 *                           type: integer
 *       401:
 *         description: Non authentifié
 */
router.get('/stats', getUserStats);

export default router;