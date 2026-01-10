import Workout from '../models/Workout.js';
import Exercise from '../models/Exercise.js';

// @desc    Récupérer tous les programmes de l'utilisateur
// @route   GET /api/workouts
// @access  Private
export const getMyWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id })
      .populate('exercices.exerciceId', 'nom groupeMusculaire difficulte')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: workouts.length,
      data: workouts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer un programme par ID
// @route   GET /api/workouts/:id
// @access  Private
export const getWorkoutById = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id)
      .populate('exercices.exerciceId');
    
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Programme non trouvé'
      });
    }
    
    // Vérifier que le programme appartient à l'utilisateur
    if (workout.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à accéder à ce programme'
      });
    }
    
    res.status(200).json({
      success: true,
      data: workout
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un nouveau programme
// @route   POST /api/workouts
// @access  Private
export const createWorkout = async (req, res, next) => {
  try {
    const { nom, description, exercices } = req.body;
    
    // Validation
    if (!nom || !exercices || exercices.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nom et exercices requis'
      });
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
    
    // Créer le programme
    const workout = await Workout.create({
      nom,
      description,
      userId: req.user.id,
      exercices
    });
    
    // Populate pour retourner les détails
    await workout.populate('exercices.exerciceId', 'nom groupeMusculaire');
    
    res.status(201).json({
      success: true,
      message: 'Programme créé avec succès',
      data: workout
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un programme
// @route   PUT /api/workouts/:id
// @access  Private
export const updateWorkout = async (req, res, next) => {
  try {
    let workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Programme non trouvé'
      });
    }
    
    // Vérifier que le programme appartient à l'utilisateur
    if (workout.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier ce programme'
      });
    }
    
    // Si on modifie les exercices, vérifier qu'ils existent
    if (req.body.exercices) {
      for (let exercice of req.body.exercices) {
        const exerciceExists = await Exercise.findById(exercice.exerciceId);
        if (!exerciceExists) {
          return res.status(400).json({
            success: false,
            message: `Exercice ${exercice.exerciceId} n'existe pas`
          });
        }
      }
    }
    
    workout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('exercices.exerciceId', 'nom groupeMusculaire');
    
    res.status(200).json({
      success: true,
      message: 'Programme mis à jour',
      data: workout
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un programme
// @route   DELETE /api/workouts/:id
// @access  Private
export const deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Programme non trouvé'
      });
    }
    
    // Vérifier que le programme appartient à l'utilisateur
    if (workout.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer ce programme'
      });
    }
    
    await workout.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Programme supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};