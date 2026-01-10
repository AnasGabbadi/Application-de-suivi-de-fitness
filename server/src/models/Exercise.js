import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de l\'exercice est requis'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  groupeMusculaire: {
    type: String,
    required: true,
    enum: ['Pectoraux', 'Dos', 'Jambes', 'Épaules', 'Biceps', 'Triceps', 'Abdominaux', 'Cardio'],
    index: true
  },
  categorie: {
    type: String,
    enum: ['Force', 'Cardio', 'Flexibilité'],
    default: 'Force'
  },
  difficulte: {
    type: String,
    enum: ['Débutant', 'Intermédiaire', 'Avancé'],
    default: 'Intermédiaire'
  },
  imageUrl: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true 
  }
}, {
  timestamps: true
});

exerciseSchema.index({ createdBy: 1, groupeMusculaire: 1 });
exerciseSchema.index({ createdBy: 1, createdAt: -1 });

export default mongoose.model('Exercise', exerciseSchema);