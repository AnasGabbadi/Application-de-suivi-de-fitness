import WorkoutLog from '../models/WorkoutLog.js';
import Workout from '../models/Workout.js';
import Exercise from '../models/Exercise.js';

// @desc    Récupérer tous les logs de l'utilisateur
// @route   GET /api/logs
// @access  Private
export const getMyLogs = async (req, res, next) => {
  try {
    const { startDate, endDate, limit = 50 } = req.query;
    
    let filter = { userId: req.user.id };
    
    // Filtrer par dates
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    const logs = await WorkoutLog.find(filter)
      .populate('workoutId', 'nom')
      .populate('exercices.exerciceId', 'nom groupeMusculaire')
      .sort({ date: -1 })
      .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer un log par ID
// @route   GET /api/logs/:id
// @access  Private
export const getLogById = async (req, res, next) => {
  try {
    const log = await WorkoutLog.findById(req.params.id)
      .populate('workoutId', 'nom description')
      .populate('exercices.exerciceId');
    
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Séance non trouvée'
      });
    }
    
    // Vérifier que le log appartient à l'utilisateur
    if (log.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: log
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un nouveau log (enregistrer une séance)
// @route   POST /api/logs
// @access  Private
export const createLog = async (req, res, next) => {
  try {
    const { workoutId, exercices, duree, notes, date } = req.body;
    
    // Validation
    if (!exercices || exercices.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Au moins un exercice est requis'
      });
    }
    
    // Vérifier que le workout existe et appartient à l'utilisateur (si fourni)
    if (workoutId) {
      const workout = await Workout.findById(workoutId);
      if (!workout || workout.userId.toString() !== req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Programme invalide'
        });
      }
    }
    
    // Vérifier que tous les exercices existent
    for (let exercice of exercices) {
      const exerciceExists = await Exercise.findById(exercice.exerciceId);
      if (!exerciceExists) {
        return res.status(400).json({
          success: false,
          message: `Exercice ${exercice.exerciceId} n'existe pas`
        });
      }
    }
    
    // Créer le log
    const log = await WorkoutLog.create({
      userId: req.user.id,
      workoutId,
      exercices,
      duree,
      notes,
      date: date || Date.now()
    });
    
    // Populate pour retourner les détails
    await log.populate('exercices.exerciceId', 'nom groupeMusculaire');
    
    res.status(201).json({
      success: true,
      message: 'Séance enregistrée avec succès',
      data: log
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un log
// @route   PUT /api/logs/:id
// @access  Private
export const updateLog = async (req, res, next) => {
  try {
    let log = await WorkoutLog.findById(req.params.id);
    
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Séance non trouvée'
      });
    }
    
    // Vérifier que le log appartient à l'utilisateur
    if (log.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }
    
    log = await WorkoutLog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('exercices.exerciceId', 'nom groupeMusculaire');
    
    res.status(200).json({
      success: true,
      message: 'Séance mise à jour',
      data: log
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un log
// @route   DELETE /api/logs/:id
// @access  Private
export const deleteLog = async (req, res, next) => {
  try {
    const log = await WorkoutLog.findById(req.params.id);
    
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Séance non trouvée'
      });
    }
    
    // Vérifier que le log appartient à l'utilisateur
    if (log.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }
    
    await log.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Séance supprimée avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer les statistiques de l'utilisateur
// @route   GET /api/logs/stats/me
// @access  Private
export const getMyStats = async (req, res, next) => {
  try {
    const logs = await WorkoutLog.find({ userId: req.user.id });
    
    // Calculer les statistiques
    const totalSeances = logs.length;
    const totalDuree = logs.reduce((sum, log) => sum + (log.duree || 0), 0);
    
    // Dernière séance
    const derniereSeance = logs.length > 0 
      ? logs.sort((a, b) => b.date - a.date)[0].date 
      : null;
    
    res.status(200).json({
      success: true,
      data: {
        totalSeances,
        totalDuree,
        moyenneDuree: totalSeances > 0 ? Math.round(totalDuree / totalSeances) : 0,
        derniereSeance
      }
    });
  } catch (error) {
    next(error);
  }
};