import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  poids: {
    type: Number,
    min: 0
  },
  imc: {
    type: Number
  },
  mensurations: {
    tourTaille: Number,
    tourPoitrine: Number,
    tourBras: Number,
    tourCuisses: Number
  }
}, {
  timestamps: true
});

progressSchema.pre('save', async function() {
  if (this.poids) {
    const User = mongoose.model('User');
    const user = await User.findById(this.userId);
    if (user && user.taille) {
      const tailleEnMetres = user.taille / 100;
      this.imc = parseFloat((this.poids / (tailleEnMetres * tailleEnMetres)).toFixed(2));
    }
  }
});

export default mongoose.model('Progress', progressSchema);