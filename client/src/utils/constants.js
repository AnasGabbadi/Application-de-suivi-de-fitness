// ====================================
// EXERCICES
// ====================================

// Groupes musculaires disponibles (selon backend Exercise.js)
export const MUSCLE_GROUPS = [
  'Pectoraux',
  'Dos',
  'Jambes',
  'Épaules',
  'Biceps',
  'Triceps',
  'Abdominaux',
  'Cardio',
];

// Catégories d'exercices (selon backend Exercise.js)
export const CATEGORIES = [
  'Force',
  'Cardio',
  'Flexibilité',
];

// Niveaux de difficulté (selon backend Exercise.js)
export const DIFFICULTIES = [
  'Débutant',
  'Intermédiaire',
  'Avancé',
];

// ====================================
// UTILISATEUR
// ====================================

// Objectifs fitness (selon backend User.js)
export const OBJECTIVES = [
  'perte_poids',
  'prise_masse',
  'maintien',     // ✅ CORRIGÉ : était "tonification"
  'endurance',
];

// Labels pour les objectifs (pour l'affichage)
export const OBJECTIVE_LABELS = {
  perte_poids: 'Perte de poids',
  prise_masse: 'Prise de masse',
  maintien: 'Maintien',           // ✅ CORRIGÉ
  endurance: 'Endurance',
};

// ====================================
// IMC (Indice de Masse Corporelle)
// ====================================

export const IMC_CATEGORIES = {
  MAIGREUR: { 
    max: 18.5, 
    label: 'Maigreur', 
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  NORMAL: { 
    min: 18.5, 
    max: 25, 
    label: 'Normal', 
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  SURPOIDS: { 
    min: 25, 
    max: 30, 
    label: 'Surpoids', 
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  OBESITE: { 
    min: 30, 
    label: 'Obésité', 
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
};

// ====================================
// ENTRAÎNEMENT
// ====================================

// Temps de repos par défaut (en secondes)
export const DEFAULT_REST_TIME = 90;

// Durées de séance suggérées (en minutes)
export const WORKOUT_DURATIONS = [30, 45, 60, 90, 120];

// Nombre de séries par défaut
export const DEFAULT_SETS = 3;

// Nombre de répétitions par défaut
export const DEFAULT_REPS = 10;

// ====================================
// MESSAGES
// ====================================

export const SUCCESS_MESSAGES = {
  LOGIN: 'Connexion réussie !',
  REGISTER: 'Inscription réussie !',
  PROFILE_UPDATED: 'Profil mis à jour avec succès',
  PASSWORD_CHANGED: 'Mot de passe modifié avec succès',
  EXERCISE_CREATED: 'Exercice créé avec succès',
  EXERCISE_UPDATED: 'Exercice mis à jour avec succès',
  EXERCISE_DELETED: 'Exercice supprimé avec succès',
  WORKOUT_CREATED: 'Programme créé avec succès',
  WORKOUT_UPDATED: 'Programme mis à jour avec succès',
  WORKOUT_DELETED: 'Programme supprimé avec succès',
  LOG_SAVED: 'Séance enregistrée avec succès',
  PROGRESS_ADDED: 'Progrès ajouté avec succès',
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
  UNAUTHORIZED: 'Vous devez être connecté pour accéder à cette page.',
  FORBIDDEN: 'Vous n\'avez pas les permissions nécessaires.',
  NOT_FOUND: 'Ressource introuvable.',
};

// ====================================
// EXPORT PAR DÉFAUT
// ====================================

export default {
  MUSCLE_GROUPS,
  CATEGORIES,
  DIFFICULTIES,
  OBJECTIVES,
  OBJECTIVE_LABELS,
  IMC_CATEGORIES,
  DEFAULT_REST_TIME,
  WORKOUT_DURATIONS,
  DEFAULT_SETS,
  DEFAULT_REPS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
};