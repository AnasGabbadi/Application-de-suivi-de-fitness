import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Inscription
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { nom, prenom, email, password, age, poids, taille, objectif } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }
    
    // Créer l'utilisateur
    const user = await User.create({
      nom,
      prenom,
      email,
      password,
      age,
      poids,
      taille,
      objectif
    });
    
    // Générer le token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      data: {
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        objectif: user.objectif
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Connexion
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }
    
    // Trouver l'utilisateur avec le password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }
    
    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }
    
    // Générer le token
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        objectif: user.objectif
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir le profil utilisateur connecté
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};