// ====================================
// DATES
// ====================================

// Formater une date
export const formatDate = (date, locale = 'fr-FR') => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Formater une date courte
export const formatShortDate = (date, locale = 'fr-FR') => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// Formater une heure
export const formatTime = (date, locale = 'fr-FR') => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Formater une date et heure
export const formatDateTime = (date, locale = 'fr-FR') => {
  if (!date) return '';
  return `${formatDate(date, locale)} à ${formatTime(date, locale)}`;
};

// Obtenir un message de temps relatif
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) {
    return 'À l\'instant';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  } else {
    return formatDate(date);
  }
};

// ====================================
// DURÉES
// ====================================

// Formater une durée en minutes
export const formatDuration = (minutes) => {
  if (!minutes) return '0 min';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} min`;
  }
  
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}min`;
};

// Formater un temps en secondes vers MM:SS
export const formatSeconds = (seconds) => {
  if (!seconds && seconds !== 0) return '00:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// ====================================
// NOMBRES
// ====================================

// Formater un nombre avec des espaces (milliers)
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined) return '0';
  return parseFloat(number).toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Formater un poids
export const formatWeight = (weight) => {
  if (!weight) return '0 kg';
  return `${formatNumber(weight, 1)} kg`;
};

// Formater une taille
export const formatHeight = (height) => {
  if (!height) return '0 cm';
  return `${formatNumber(height, 0)} cm`;
};

// ====================================
// IMC (Indice de Masse Corporelle)
// ====================================

// Formater un IMC
export const formatIMC = (imc) => {
  if (!imc) return '0.0';
  return formatNumber(imc, 1);
};

// Calculer l'IMC
export const calculateIMC = (weight, height) => {
  if (!weight || !height) return null;
  const imc = weight / Math.pow(height / 100, 2);
  return parseFloat(imc.toFixed(1));
};

// Obtenir la catégorie IMC
export const getIMCCategory = (imc) => {
  if (imc < 18.5) {
    return {
      label: 'Maigreur',
      range: '< 18.5',
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400'
    };
  } else if (imc >= 18.5 && imc < 25) {
    return {
      label: 'Normal',
      range: '18.5 - 24.9',
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400'
    };
  } else if (imc >= 25 && imc < 30) {
    return {
      label: 'Surpoids',
      range: '25.0 - 29.9',
      color: 'orange',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      textColor: 'text-orange-600 dark:text-orange-400'
    };
  } else {
    return {
      label: 'Obésité',
      range: '≥ 30',
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-600 dark:text-red-400'
    };
  }
};

// ====================================
// TEXTE
// ====================================

// Formater un nom complet
export const formatFullName = (prenom, nom) => {
  if (!prenom && !nom) return 'Utilisateur';
  if (!prenom) return nom;
  if (!nom) return prenom;
  return `${prenom} ${nom}`;
};

// Formater des initiales
export const formatInitials = (prenom, nom) => {
  const firstInitial = prenom ? prenom.charAt(0).toUpperCase() : '';
  const lastInitial = nom ? nom.charAt(0).toUpperCase() : '';
  return `${firstInitial}${lastInitial}` || '?';
};

// Tronquer un texte
export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Capitaliser la première lettre
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Capitaliser chaque mot
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

// ====================================
// SPÉCIFIQUE FITNESS
// ====================================

// Formater un objectif
export const formatObjective = (objective) => {
  const objectives = {
    perte_poids: 'Perte de poids',
    prise_masse: 'Prise de masse',
    maintien: 'Maintien',         // ✅ CORRIGÉ
    endurance: 'Endurance',
  };
  
  return objectives[objective] || objective;
};

// Formater un niveau de difficulté
export const formatDifficulty = (difficulty) => {
  const difficulties = {
    debutant: 'Débutant',
    Débutant: 'Débutant',
    intermediaire: 'Intermédiaire',
    Intermédiaire: 'Intermédiaire',
    avance: 'Avancé',
    Avancé: 'Avancé',
  };
  
  return difficulties[difficulty] || capitalize(difficulty);
};

// ====================================
// EXPORT PAR DÉFAUT
// ====================================

export default {
  formatDate,
  formatShortDate,
  formatTime,
  formatDateTime,
  getRelativeTime,
  formatDuration,
  formatSeconds,
  formatNumber,
  formatWeight,
  formatHeight,
  formatIMC,
  calculateIMC,
  getIMCCategory,
  formatFullName,
  formatInitials,
  truncate,
  capitalize,
  capitalizeWords,
  formatObjective,
  formatDifficulty,
};