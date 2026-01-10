import Progress from '../models/Progress.js';
import User from '../models/User.js';

// @desc    Récupérer toutes les mesures de l'utilisateur
// @route   GET /api/progress
// @access  Private
export const getMyProgress = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    let filter = { userId: req.user.id };
    
    // Filtrer par dates
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    const progress = await Progress.find(filter).sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ajouter une nouvelle mesure
// @route   POST /api/progress
// @access  Private
export const addProgress = async (req, res, next) => {
  try {
    const { poids, date, mensurations } = req.body;
    
    // Récupérer l'utilisateur pour calculer l'IMC
    const user = await User.findById(req.user.id);
    
    let imc = null;
    if (poids && user.taille) {
      const tailleEnMetres = user.taille / 100;
      imc = (poids / (tailleEnMetres * tailleEnMetres)).toFixed(2);
    }
    
    const progress = await Progress.create({
      userId: req.user.id,
      poids,
      imc,
      date: date || Date.now(),
      mensurations
    });
    
    res.status(201).json({
      success: true,
      message: 'Mesure ajoutée avec succès',
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer une mesure
// @route   DELETE /api/progress/:id
// @access  Private
export const deleteProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findById(req.params.id);
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Mesure non trouvée'
      });
    }
    
    // Vérifier que la mesure appartient à l'utilisateur
    if (progress.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }
    
    await progress.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Mesure supprimée avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer la dernière mesure
// @route   GET /api/progress/latest
// @access  Private
export const getLatestProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({ userId: req.user.id })
      .sort({ date: -1 });
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Aucune mesure trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};