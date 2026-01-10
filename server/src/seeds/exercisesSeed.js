// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import Exercise from '../models/Exercise.js';

// dotenv.config();

// const exercicesDeBase = [
//   { nom: 'Développé couché', groupeMusculaire: 'Pectoraux', description: 'Exercice de base pour les pectoraux', difficulte: 'Intermédiaire', categorie: 'Force' },
//   { nom: 'Squat', groupeMusculaire: 'Jambes', description: 'Exercice de base pour les cuisses et fessiers', difficulte: 'Intermédiaire', categorie: 'Force' },
//   { nom: 'Soulevé de terre', groupeMusculaire: 'Dos', description: 'Exercice polyarticulaire pour le dos et les jambes', difficulte: 'Avancé', categorie: 'Force' },
//   { nom: 'Développé militaire', groupeMusculaire: 'Épaules', description: 'Exercice pour les épaules avec barre', difficulte: 'Intermédiaire', categorie: 'Force' },
//   { nom: 'Traction', groupeMusculaire: 'Dos', description: 'Exercice au poids du corps pour le dos', difficulte: 'Intermédiaire', categorie: 'Force' },
//   { nom: 'Curl biceps', groupeMusculaire: 'Biceps', description: 'Exercice d\'isolation pour les biceps', difficulte: 'Débutant', categorie: 'Force' },
//   { nom: 'Extension triceps', groupeMusculaire: 'Triceps', description: 'Exercice d\'isolation pour les triceps', difficulte: 'Débutant', categorie: 'Force' },
//   { nom: 'Leg press', groupeMusculaire: 'Jambes', description: 'Exercice guidé pour les cuisses', difficulte: 'Débutant', categorie: 'Force' },
//   { nom: 'Rowing barre', groupeMusculaire: 'Dos', description: 'Exercice pour l\'épaisseur du dos', difficulte: 'Intermédiaire', categorie: 'Force' },
//   { nom: 'Dips', groupeMusculaire: 'Pectoraux', description: 'Exercice au poids du corps pour pectoraux et triceps', difficulte: 'Intermédiaire', categorie: 'Force' },
//   { nom: 'Fentes', groupeMusculaire: 'Jambes', description: 'Exercice pour les cuisses et fessiers', difficulte: 'Débutant', categorie: 'Force' },
//   { nom: 'Élévations latérales', groupeMusculaire: 'Épaules', description: 'Exercice d\'isolation pour les épaules', difficulte: 'Débutant', categorie: 'Force' },
//   { nom: 'Course à pied', groupeMusculaire: 'Cardio', description: 'Exercice cardio pour l\'endurance', difficulte: 'Débutant', categorie: 'Cardio' },
//   { nom: 'Vélo', groupeMusculaire: 'Cardio', description: 'Exercice cardio à faible impact', difficulte: 'Débutant', categorie: 'Cardio' },
//   { nom: 'Burpees', groupeMusculaire: 'Cardio', description: 'Exercice complet du corps', difficulte: 'Avancé', categorie: 'Cardio' }
// ];

// const seedExercises = async () => {
//   try {
//     // Connexion à MongoDB
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('✅ Connecté à MongoDB');

//     // Supprimer les exercices existants
//     await Exercise.deleteMany({});
//     console.log('🗑️  Exercices existants supprimés');

//     // Insérer les nouveaux exercices
//     const exercises = await Exercise.insertMany(exercicesDeBase);
//     console.log(`✅ ${exercises.length} exercices insérés avec succès!`);

//     // Afficher les exercices
//     exercises.forEach((ex, index) => {
//       console.log(`${index + 1}. ${ex.nom} - ${ex.groupeMusculaire} (${ex.difficulte})`);
//     });

//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Erreur:', error.message);
//     process.exit(1);
//   }
// };

// seedExercises();