import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du programme est requis'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  exercices: [{
    exerciceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true
    },
    ordre: {
      type: Number,
      default: 0
    },
    seriesCible: {
      type: Number,
      default: 3,
      min: 1
    },
    repsCible: {
      type: Number,
      default: 10,
      min: 1
    },
    tempsRepos: {
      type: Number,
      default: 60
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model('Workout', workoutSchema);