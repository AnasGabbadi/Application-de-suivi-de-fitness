const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors
    });
  }
  
  // Erreur de cast MongoDB (ID invalide)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Ressource non trouvée'
    });
  }
  
  // Erreur de duplication MongoDB
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Cette valeur existe déjà'
    });
  }
  
  // Erreur générique
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Erreur serveur'
  });
};

export default errorHandler;