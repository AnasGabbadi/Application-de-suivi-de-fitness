import mongoose from 'mongoose';

const workoutLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  workoutId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout'
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  duree: {
    type: Number,
    min: 0
  },
  exercices: [{
    exerciceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true
    },
    series: [{
      poids: {
        type: Number,
        default: 0,
        min: 0
      },
      reps: {
        type: Number,
        required: true,
        min: 1
      }
    }]
  }],
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

workoutLogSchema.index({ userId: 1, date: -1 });

export default mongoose.model('WorkoutLog', workoutLogSchema);