import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification des utilisateurs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - prenom
 *               - email
 *               - password
 *             properties:
 *               nom:
 *                 type: string
 *                 description: Nom de famille
 *                 example: GABBADI
 *               prenom:
 *                 type: string
 *                 description: Prénom
 *                 example: Anas
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email unique
 *                 example: anas@test.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Mot de passe (min 6 caractères)
 *                 example: "123456"
 *               age:
 *                 type: integer
 *                 minimum: 13
 *                 maximum: 120
 *                 description: Âge de l'utilisateur
 *                 example: 22
 *               poids:
 *                 type: number
 *                 minimum: 30
 *                 maximum: 300
 *                 description: Poids en kg
 *                 example: 75
 *               taille:
 *                 type: integer
 *                 minimum: 100
 *                 maximum: 250
 *                 description: Taille en cm
 *                 example: 175
 *               objectif:
 *                 type: string
 *                 enum: [perte_poids, prise_masse, maintien, endurance]
 *                 description: Objectif fitness
 *                 example: prise_masse
 *     responses:
 *       201:
 *         description: Inscription réussie
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
 *                   example: Inscription réussie
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nom:
 *                       type: string
 *                     prenom:
 *                       type: string
 *                     email:
 *                       type: string
 *                     objectif:
 *                       type: string
 *                 token:
 *                   type: string
 *                   description: JWT token pour l'authentification
 *       400:
 *         description: Erreur de validation ou email déjà utilisé
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
 *                   example: Erreurs de validation
 */
router.post('/register', [
  body('nom').trim().notEmpty().withMessage('Le nom est requis').isLength({ min: 2, max: 50 }),
  body('prenom').trim().notEmpty().withMessage('Le prénom est requis').isLength({ min: 2, max: 50 }),
  body('email').trim().notEmpty().withMessage('L\'email est requis').isEmail().withMessage('Format d\'email invalide').normalizeEmail(),
  body('password').notEmpty().withMessage('Le mot de passe est requis').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('age').optional().isInt({ min: 13, max: 120 }).withMessage('L\'âge doit être entre 13 et 120 ans'),
  body('poids').optional().isFloat({ min: 30, max: 300 }).withMessage('Le poids doit être entre 30 et 300 kg'),
  body('taille').optional().isInt({ min: 100, max: 250 }).withMessage('La taille doit être entre 100 et 250 cm'),
  body('objectif').optional().isIn(['perte_poids', 'prise_masse', 'maintien', 'endurance']).withMessage('Objectif invalide (perte_poids, prise_masse, maintien, endurance)'),
  validate
], register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: anas@test.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Connexion réussie
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
 *                   example: Connexion réussie
 *                 data:
 *                   type: object
 *                 token:
 *                   type: string
 *       400:
 *         description: Email et mot de passe requis
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', [
  body('email').trim().notEmpty().withMessage('L\'email est requis').isEmail().withMessage('Format d\'email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est requis'),
  validate
], login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtenir le profil de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré avec succès
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
 *                     nom:
 *                       type: string
 *                     prenom:
 *                       type: string
 *                     email:
 *                       type: string
 *                     age:
 *                       type: integer
 *                     poids:
 *                       type: number
 *                     taille:
 *                       type: integer
 *                     objectif:
 *                       type: string
 *       401:
 *         description: Non authentifié - Token manquant ou invalide
 */
router.get('/me', protect, getMe);

export default router;