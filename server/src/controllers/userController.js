import User from '../models/User.js';
import bcrypt from 'bcrypt';

// @desc    Récupérer le profil de l'utilisateur connecté
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour le profil
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    // Champs autorisés à être modifiés
    const { nom, prenom, age, poids, taille, objectif } = req.body;
    
    const fieldsToUpdate = {};
    if (nom) fieldsToUpdate.nom = nom;
    if (prenom) fieldsToUpdate.prenom = prenom;
    if (age) fieldsToUpdate.age = age;
    if (poids) fieldsToUpdate.poids = poids;
    if (taille) fieldsToUpdate.taille = taille;
    if (objectif) fieldsToUpdate.objectif = objectif;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Changer le mot de passe
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel et nouveau mot de passe requis'
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      });
    }
    
    // Récupérer l'utilisateur avec le password
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    // Vérifier le mot de passe actuel
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }
    
    // Mettre à jour le mot de passe (sera automatiquement hashé par le middleware du modèle)
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer le compte
// @route   DELETE /api/users/account
// @access  Private
export const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;
    
    // Validation
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe requis pour supprimer le compte'
      });
    }
    
    // Récupérer l'utilisateur avec le password
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe incorrect'
      });
    }
    
    // Supprimer l'utilisateur (cascade delete des workouts, logs, progress grâce à MongoDB)
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Compte supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les statistiques globales de l'utilisateur
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = async (req, res, next) => {
  try {
    // Import des modèles nécessaires (à mettre en haut du fichier normalement)
    const WorkoutLog = (await import('../models/WorkoutLog.js')).default;
    const Workout = (await import('../models/Workout.js')).default;
    const Progress = (await import('../models/Progress.js')).default;
    
    const user = await User.findById(req.user.id);
    
    // Compter les workouts créés
    const totalWorkouts = await Workout.countDocuments({ userId: req.user.id });
    
    // Compter les séances effectuées
    const totalLogs = await WorkoutLog.countDocuments({ userId: req.user.id });
    
    // Récupérer la progression de poids
    const progressData = await Progress.find({ userId: req.user.id, poids: { $exists: true } })
      .sort({ date: 1 })
      .limit(2); // Premier et dernier
    
    let poidsEvolution = null;
    if (progressData.length >= 2) {
      const poidsInitial = progressData[0].poids;
      const poidsFinal = progressData[progressData.length - 1].poids;
      poidsEvolution = {
        initial: poidsInitial,
        actuel: poidsFinal,
        difference: (poidsFinal - poidsInitial).toFixed(1)
      };
    }
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          objectif: user.objectif,
          age: user.age,
          poids: user.poids,
          taille: user.taille
        },
        stats: {
          totalProgrammes: totalWorkouts,
          totalSeances: totalLogs,
          poidsEvolution
        }
      }
    });
  } catch (error) {
    next(error);
  }
};