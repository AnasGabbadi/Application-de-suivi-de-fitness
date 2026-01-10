import Exercise from '../models/Exercise.js';

// @desc    Récupérer tous les exercices DE L'UTILISATEUR CONNECTÉ
// @route   GET /api/exercises
// @access  Private  ⚠️ CHANGÉ de Public à Private
export const getAllExercises = async (req, res, next) => {
  try {
    const { groupeMusculaire, difficulte, categorie } = req.query;
    
    // ✅ CORRECTION : Filtrer par utilisateur connecté
    let filter = { createdBy: req.user.id };
    
    if (groupeMusculaire) filter.groupeMusculaire = groupeMusculaire;
    if (difficulte) filter.difficulte = difficulte;
    if (categorie) filter.categorie = categorie;
    
    const exercises = await Exercise.find(filter).sort({ nom: 1 });
    
    res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer un exercice par ID
// @route   GET /api/exercises/:id
// @access  Private  ⚠️ CHANGÉ de Public à Private
export const getExerciseById = async (req, res, next) => {
  try {
    // ✅ CORRECTION : Vérifier que l'exercice appartient à l'utilisateur
    const exercise = await Exercise.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });
    
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercice non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un nouvel exercice
// @route   POST /api/exercises
// @access  Private
export const createExercise = async (req, res, next) => {
  try {
    // ✅ Assigner automatiquement l'utilisateur connecté
    req.body.createdBy = req.user.id;
    
    const exercise = await Exercise.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Exercice créé avec succès',
      data: exercise
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un exercice
// @route   PUT /api/exercises/:id
// @access  Private
export const updateExercise = async (req, res, next) => {
  try {
    // ✅ Vérifier que l'exercice appartient à l'utilisateur
    let exercise = await Exercise.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });
    
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercice non trouvé'
      });
    }
    
    // Empêcher la modification du createdBy
    delete req.body.createdBy;
    
    exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      message: 'Exercice modifié avec succès',
      data: exercise
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un exercice
// @route   DELETE /api/exercises/:id
// @access  Private
export const deleteExercise = async (req, res, next) => {
  try {
    // ✅ Vérifier que l'exercice appartient à l'utilisateur
    const exercise = await Exercise.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });
    
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercice non trouvé'
      });
    }
    
    await exercise.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Exercice supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};