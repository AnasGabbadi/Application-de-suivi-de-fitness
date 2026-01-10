// ====================================
// VALIDATIONS DE BASE
// ====================================

// Validation d'email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validation de mot de passe
export const isValidPassword = (password) => {
  // Au moins 6 caractères (selon backend User.js)
  return password && password.length >= 6;
};

// Validation de mot de passe fort
export const isStrongPassword = (password) => {
  // Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return strongPasswordRegex.test(password);
};

// Validation de numéro de téléphone
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone);
};

// Validation de date
export const isValidDate = (date) => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

// Validation de champ requis
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined && value !== '';
};

// Validation de longueur minimale
export const minLength = (value, min) => {
  return value && value.length >= min;
};

// Validation de longueur maximale
export const maxLength = (value, max) => {
  return value && value.length <= max;
};

// Validation de nombre
export const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

// Validation de nombre positif
export const isPositiveNumber = (value) => {
  return isNumber(value) && parseFloat(value) > 0;
};

// Validation de range
export const isInRange = (value, min, max) => {
  const num = parseFloat(value);
  return isNumber(value) && num >= min && num <= max;
};

// Validation d'URL
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ====================================
// VALIDATIONS SPÉCIFIQUES FITNESS
// ====================================

// Validation d'âge (✅ CORRIGÉ pour correspondre au backend)
export const isValidAge = (age) => {
  return isNumber(age) && age >= 13 && age <= 120;
};

// Validation de poids
export const isValidWeight = (weight) => {
  return isInRange(weight, 20, 300);
};

// Validation de taille
export const isValidHeight = (height) => {
  return isInRange(height, 100, 250);
};

// ====================================
// VALIDATIONS DE FORMULAIRES
// ====================================

// Validation de formulaire d'exercice
export const validateExercise = (data) => {
  const errors = {};

  if (!isRequired(data.nom)) {
    errors.nom = 'Le nom est requis';
  } else if (!minLength(data.nom, 3)) {
    errors.nom = 'Le nom doit contenir au moins 3 caractères';
  }

  if (!isRequired(data.description)) {
    errors.description = 'La description est requise';
  } else if (!minLength(data.description, 10)) {
    errors.description = 'La description doit contenir au moins 10 caractères';
  }

  if (!isRequired(data.groupeMusculaire)) {
    errors.groupeMusculaire = 'Le groupe musculaire est requis';
  }

  if (!isRequired(data.difficulte)) {
    errors.difficulte = 'La difficulté est requise';
  }

  if (data.imageUrl && !isValidURL(data.imageUrl)) {
    errors.imageUrl = 'URL de l\'image invalide';
  }

  return errors;
};

// Validation de formulaire de programme
export const validateWorkout = (data) => {
  const errors = {};

  if (!isRequired(data.nom)) {
    errors.nom = 'Le nom est requis';
  } else if (!minLength(data.nom, 3)) {
    errors.nom = 'Le nom doit contenir au moins 3 caractères';
  }

  if (data.description && !minLength(data.description, 10)) {
    errors.description = 'La description doit contenir au moins 10 caractères';
  }

  if (!data.exercices || data.exercices.length === 0) {
    errors.exercices = 'Au moins un exercice est requis';
  }

  return errors;
};

// Validation de formulaire de profil (✅ CORRIGÉ pour utiliser age)
export const validateProfile = (data) => {
  const errors = {};

  if (!isRequired(data.nom)) {
    errors.nom = 'Le nom est requis';
  } else if (!minLength(data.nom, 2)) {
    errors.nom = 'Le nom doit contenir au moins 2 caractères';
  }

  if (!isRequired(data.prenom)) {
    errors.prenom = 'Le prénom est requis';
  } else if (!minLength(data.prenom, 2)) {
    errors.prenom = 'Le prénom doit contenir au moins 2 caractères';
  }

  if (!isRequired(data.email)) {
    errors.email = 'L\'email est requis';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email invalide';
  }

  // ✅ CORRIGÉ : Utiliser age au lieu de dateNaissance
  if (data.age && !isValidAge(data.age)) {
    errors.age = 'L\'âge doit être entre 13 et 120 ans';
  }

  if (data.poids && !isValidWeight(data.poids)) {
    errors.poids = 'Le poids doit être entre 20 et 300 kg';
  }

  if (data.taille && !isValidHeight(data.taille)) {
    errors.taille = 'La taille doit être entre 100 et 250 cm';
  }

  if (!isRequired(data.objectif)) {
    errors.objectif = 'L\'objectif est requis';
  }

  return errors;
};

// Validation de connexion
export const validateLogin = (data) => {
  const errors = {};

  if (!isRequired(data.email)) {
    errors.email = 'L\'email est requis';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email invalide';
  }

  if (!isRequired(data.password)) {
    errors.password = 'Le mot de passe est requis';
  }

  return errors;
};

// Validation d'inscription (✅ CORRIGÉ pour utiliser age)
export const validateRegister = (data) => {
  const errors = {};

  if (!isRequired(data.nom)) {
    errors.nom = 'Le nom est requis';
  } else if (!minLength(data.nom, 2)) {
    errors.nom = 'Le nom doit contenir au moins 2 caractères';
  }

  if (!isRequired(data.prenom)) {
    errors.prenom = 'Le prénom est requis';
  } else if (!minLength(data.prenom, 2)) {
    errors.prenom = 'Le prénom doit contenir au moins 2 caractères';
  }

  if (!isRequired(data.email)) {
    errors.email = 'L\'email est requis';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email invalide';
  }

  if (!isRequired(data.password)) {
    errors.password = 'Le mot de passe est requis';
  } else if (!isValidPassword(data.password)) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
  }

  if (data.confirmPassword !== data.password) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }

  // ✅ CORRIGÉ : Valider age au lieu de dateNaissance
  if (data.age && !isValidAge(data.age)) {
    errors.age = 'L\'âge doit être entre 13 et 120 ans';
  }

  if (data.poids && !isValidWeight(data.poids)) {
    errors.poids = 'Le poids doit être entre 20 et 300 kg';
  }

  if (data.taille && !isValidHeight(data.taille)) {
    errors.taille = 'La taille doit être entre 100 et 250 cm';
  }

  if (!isRequired(data.objectif)) {
    errors.objectif = 'L\'objectif est requis';
  }

  return errors;
};

// Validation de changement de mot de passe
export const validateChangePassword = (data) => {
  const errors = {};

  if (!isRequired(data.currentPassword)) {
    errors.currentPassword = 'Le mot de passe actuel est requis';
  }

  if (!isRequired(data.newPassword)) {
    errors.newPassword = 'Le nouveau mot de passe est requis';
  } else if (!isValidPassword(data.newPassword)) {
    errors.newPassword = 'Le nouveau mot de passe doit contenir au moins 6 caractères';
  }

  if (data.confirmPassword !== data.newPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }

  if (data.currentPassword === data.newPassword) {
    errors.newPassword = 'Le nouveau mot de passe doit être différent de l\'ancien';
  }

  return errors;
};

// ====================================
// EXPORT PAR DÉFAUT
// ====================================

export default {
  isValidEmail,
  isValidPassword,
  isStrongPassword,
  isValidPhone,
  isValidDate,
  isRequired,
  minLength,
  maxLength,
  isNumber,
  isPositiveNumber,
  isInRange,
  isValidURL,
  isValidAge,
  isValidWeight,
  isValidHeight,
  validateExercise,
  validateWorkout,
  validateProfile,
  validateLogin,
  validateRegister,
  validateChangePassword,
};