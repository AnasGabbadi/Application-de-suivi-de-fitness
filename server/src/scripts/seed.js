import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Exercise from '../models/Exercise.js';
import Workout from '../models/Workout.js';
import WorkoutLog from '../models/WorkoutLog.js';
import Progress from '../models/Progress.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connecté');
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    process.exit(1);
  }
};

// 👤 DONNÉES DES UTILISATEURS
const users = [
  {
    nom: 'Benali',
    prenom: 'Anas',
    email: 'anas@fitness.com',
    password: 'password123',
    poids: 75,
    taille: 178,
    age: 24,
    objectif: 'prise_masse' // ✅ CORRIGÉ
  },
  {
    nom: 'Alami',
    prenom: 'Sarah',
    email: 'sarah@fitness.com',
    password: 'password123',
    poids: 60,
    taille: 165,
    age: 22,
    objectif: 'perte_poids' // ✅ CORRIGÉ
  },
  {
    nom: 'El Fassi',
    prenom: 'Omar',
    email: 'omar@fitness.com',
    password: 'password123',
    poids: 85,
    taille: 182,
    age: 28,
    objectif: 'maintien' // ✅ CORRIGÉ
  }
];

// 💪 DONNÉES DES EXERCICES (sans le champ equipement qui n'existe pas dans le modèle)
const exercises = [
  // PECTORAUX
  {
    nom: 'Développé couché',
    description: 'Exercice de base pour les pectoraux, effectué allongé sur un banc avec une barre',
    groupeMusculaire: 'Pectoraux',
    categorie: 'Force',
    difficulte: 'Intermédiaire'
  },
  {
    nom: 'Pompes',
    description: 'Exercice au poids du corps pour travailler les pectoraux, épaules et triceps',
    groupeMusculaire: 'Pectoraux',
    categorie: 'Force',
    difficulte: 'Débutant'
  },
  {
    nom: 'Écarté couché avec haltères',
    description: 'Isolation des pectoraux en position allongée',
    groupeMusculaire: 'Pectoraux',
    categorie: 'Force',
    difficulte: 'Intermédiaire'
  },
  {
    nom: 'Dips',
    description: 'Exercice pour les pectoraux et triceps sur barres parallèles',
    groupeMusculaire: 'Pectoraux',
    categorie: 'Force',
    difficulte: 'Intermédiaire'
  },

  // DOS
  {
    nom: 'Tractions',
    description: 'Exercice de base pour le dos, à la barre fixe',
    groupeMusculaire: 'Dos',
    categorie: 'Force',
    difficulte: 'Intermédiaire'
  },
  {
    nom: 'Rowing barre',
    description: 'Tirage horizontal pour le développement du dos',
    groupeMusculaire: 'Dos',
    categorie: 'Force',
    difficulte: 'Intermédiaire'
  },
  {
    nom: 'Soulevé de terre',
    description: 'Exercice poly-articulaire majeur pour le dos et les jambes',
    groupeMusculaire: 'Dos',
    categorie: 'Force',
    difficulte: 'Avancé'
  },
  {
    nom: 'Tirage poitrine',
    description: 'Exercice sur machine pour le grand dorsal',
    groupeMusculaire: 'Dos',
    categorie: 'Force',
    difficulte: 'Débutant'
  },

  // JAMBES
  {
    nom: 'Squat',
    description: 'Exercice roi pour les jambes et les fessiers',
    groupeMusculaire: 'Jambes',
    categorie: 'Force',
    difficulte: 'Intermédiaire'
  },
  {
    nom: 'Fentes',
    description: 'Exercice unilatéral pour les jambes',
    groupeMusculaire: 'Jambes',
    categorie: 'Force',
    difficulte: 'Débutant'
  },
  {
    nom: 'Leg Press',
    description: 'Presse à cuisses pour un travail sécurisé des jambes',
    groupeMusculaire: 'Jambes',
    categorie: 'Force',
    difficulte: 'Débutant'
  },
  {
    nom: 'Leg Curl',
    description: 'Isolation des ischio-jambiers',
    groupeMusculaire: 'Jambes',
    categorie: 'Force',
    difficulte: 'Débutant'
  },

  // ÉPAULES
  {
    nom: 'Développé militaire',
    description: 'Exercice de base pour les épaules avec barre',
    groupeMusculaire: 'Épaules',
    categorie: 'Force',
    difficulte: 'Intermédiaire'
  },
  {
    nom: 'Élévations latérales',
    description: 'Isolation des deltoïdes latéraux',
    groupeMusculaire: 'Épaules',
    categorie: 'Force',
    difficulte: 'Débutant'
  },
  {
    nom: 'Oiseau',
    description: 'Exercice pour les deltoïdes postérieurs',
    groupeMusculaire: 'Épaules',
    categorie: 'Force',
    difficulte: 'Débutant'
  },

  // BRAS
  {
    nom: 'Curl biceps',
    description: 'Exercice d\'isolation pour les biceps',
    groupeMusculaire: 'Biceps',
    categorie: 'Force',
    difficulte: 'Débutant'
  },
  {
    nom: 'Extension triceps',
    description: 'Isolation des triceps à la poulie',
    groupeMusculaire: 'Triceps',
    categorie: 'Force',
    difficulte: 'Débutant'
  },
  {
    nom: 'Curl marteau',
    description: 'Variante du curl pour biceps et avant-bras',
    groupeMusculaire: 'Biceps',
    categorie: 'Force',
    difficulte: 'Débutant'
  },

  // ABDOS
  {
    nom: 'Crunch',
    description: 'Exercice de base pour les abdominaux',
    groupeMusculaire: 'Abdominaux',
    categorie: 'Force',
    difficulte: 'Débutant'
  },
  {
    nom: 'Planche',
    description: 'Gainage statique pour le tronc',
    groupeMusculaire: 'Abdominaux',
    categorie: 'Force',
    difficulte: 'Débutant'
  },
  {
    nom: 'Relevé de jambes',
    description: 'Travail du bas des abdominaux',
    groupeMusculaire: 'Abdominaux',
    categorie: 'Force',
    difficulte: 'Intermédiaire'
  },

  // CARDIO
  {
    nom: 'Course à pied',
    description: 'Cardio en extérieur ou sur tapis',
    groupeMusculaire: 'Cardio',
    categorie: 'Cardio',
    difficulte: 'Débutant'
  },
  {
    nom: 'Vélo',
    description: 'Cardio à faible impact',
    groupeMusculaire: 'Cardio',
    categorie: 'Cardio',
    difficulte: 'Débutant'
  },
  {
    nom: 'Rameur',
    description: 'Cardio complet sollicitant tout le corps',
    groupeMusculaire: 'Cardio',
    categorie: 'Cardio',
    difficulte: 'Intermédiaire'
  },
  {
    nom: 'Burpees',
    description: 'Exercice cardio intense au poids du corps',
    groupeMusculaire: 'Cardio',
    categorie: 'Cardio',
    difficulte: 'Intermédiaire'
  }
];

// 🎯 FONCTION PRINCIPALE DE SEED
const seedDatabase = async () => {
  try {
    await connectDB();

    // 🗑️ NETTOYER LA BASE DE DONNÉES
    console.log('🗑️  Nettoyage de la base de données...');
    await User.deleteMany({});
    await Exercise.deleteMany({});
    await Workout.deleteMany({});
    await WorkoutLog.deleteMany({});
    await Progress.deleteMany({});
    console.log('✅ Base de données nettoyée');

    // 👤 CRÉER LES UTILISATEURS
    console.log('👤 Création des utilisateurs...');
    const createdUsers = await User.create(users);
    console.log(`✅ ${createdUsers.length} utilisateurs créés`);

    // 💪 CRÉER LES EXERCICES (même créateur pour tous)
    console.log('💪 Création des exercices...');
    const exercisesWithUser = exercises.map(ex => ({
      ...ex,
      createdBy: createdUsers[0]._id
    }));
    const createdExercises = await Exercise.create(exercisesWithUser);
    console.log(`✅ ${createdExercises.length} exercices créés`);

    // 📋 CRÉER LES PROGRAMMES D'ENTRAÎNEMENT
    console.log('📋 Création des programmes...');
    
    // Trouver les exercices par nom
    const findExercise = (nom) => createdExercises.find(ex => ex.nom === nom);

    const workouts = [
      // Programme Push pour Anas
      {
        nom: 'Push Day - Pectoraux/Épaules/Triceps',
        description: 'Programme pour le haut du corps - muscles de poussée',
        userId: createdUsers[0]._id,
        exercices: [
          {
            exerciceId: findExercise('Développé couché')._id,
            seriesCible: 4,
            repsCible: 10,
            tempsRepos: 90
          },
          {
            exerciceId: findExercise('Développé militaire')._id,
            seriesCible: 4,
            repsCible: 10,
            tempsRepos: 90
          },
          {
            exerciceId: findExercise('Dips')._id,
            seriesCible: 3,
            repsCible: 12,
            tempsRepos: 60
          },
          {
            exerciceId: findExercise('Élévations latérales')._id,
            seriesCible: 3,
            repsCible: 15,
            tempsRepos: 45
          },
          {
            exerciceId: findExercise('Extension triceps')._id,
            seriesCible: 3,
            repsCible: 12,
            tempsRepos: 45
          }
        ]
      },
      // Programme Pull pour Anas
      {
        nom: 'Pull Day - Dos/Biceps',
        description: 'Programme pour le haut du corps - muscles de tirage',
        userId: createdUsers[0]._id,
        exercices: [
          {
            exerciceId: findExercise('Tractions')._id,
            seriesCible: 4,
            repsCible: 8,
            tempsRepos: 90
          },
          {
            exerciceId: findExercise('Rowing barre')._id,
            seriesCible: 4,
            repsCible: 10,
            tempsRepos: 90
          },
          {
            exerciceId: findExercise('Tirage poitrine')._id,
            seriesCible: 3,
            repsCible: 12,
            tempsRepos: 60
          },
          {
            exerciceId: findExercise('Curl biceps')._id,
            seriesCible: 3,
            repsCible: 12,
            tempsRepos: 45
          },
          {
            exerciceId: findExercise('Curl marteau')._id,
            seriesCible: 3,
            repsCible: 12,
            tempsRepos: 45
          }
        ]
      },
      // Programme Legs pour Anas
      {
        nom: 'Leg Day - Jambes',
        description: 'Programme pour le bas du corps',
        userId: createdUsers[0]._id,
        exercices: [
          {
            exerciceId: findExercise('Squat')._id,
            seriesCible: 4,
            repsCible: 10,
            tempsRepos: 120
          },
          {
            exerciceId: findExercise('Leg Press')._id,
            seriesCible: 4,
            repsCible: 12,
            tempsRepos: 90
          },
          {
            exerciceId: findExercise('Leg Curl')._id,
            seriesCible: 3,
            repsCible: 12,
            tempsRepos: 60
          },
          {
            exerciceId: findExercise('Fentes')._id,
            seriesCible: 3,
            repsCible: 12,
            tempsRepos: 60
          }
        ]
      },
      // Programme débutant pour Sarah
      {
        nom: 'Full Body Débutant',
        description: 'Programme complet du corps pour débutants',
        userId: createdUsers[1]._id,
        exercices: [
          {
            exerciceId: findExercise('Pompes')._id,
            seriesCible: 3,
            repsCible: 10,
            tempsRepos: 60
          },
          {
            exerciceId: findExercise('Squat')._id,
            seriesCible: 3,
            repsCible: 12,
            tempsRepos: 60
          },
          {
            exerciceId: findExercise('Tirage poitrine')._id,
            seriesCible: 3,
            repsCible: 10,
            tempsRepos: 60
          },
          {
            exerciceId: findExercise('Planche')._id,
            seriesCible: 3,
            repsCible: 30,
            tempsRepos: 45
          }
        ]
      },
      // Programme cardio pour Sarah
      {
        nom: 'Cardio & Perte de poids',
        description: 'Programme orienté cardio et perte de calories',
        userId: createdUsers[1]._id,
        exercices: [
          {
            exerciceId: findExercise('Course à pied')._id,
            seriesCible: 1,
            repsCible: 30,
            tempsRepos: 0
          },
          {
            exerciceId: findExercise('Burpees')._id,
            seriesCible: 4,
            repsCible: 15,
            tempsRepos: 60
          },
          {
            exerciceId: findExercise('Vélo')._id,
            seriesCible: 1,
            repsCible: 20,
            tempsRepos: 0
          }
        ]
      },
      // Programme avancé pour Omar
      {
        nom: 'Programme Force Avancé',
        description: 'Programme de force pour athlètes avancés',
        userId: createdUsers[2]._id,
        exercices: [
          {
            exerciceId: findExercise('Soulevé de terre')._id,
            seriesCible: 5,
            repsCible: 5,
            tempsRepos: 180
          },
          {
            exerciceId: findExercise('Squat')._id,
            seriesCible: 5,
            repsCible: 5,
            tempsRepos: 180
          },
          {
            exerciceId: findExercise('Développé couché')._id,
            seriesCible: 5,
            repsCible: 5,
            tempsRepos: 180
          }
        ]
      }
    ];

    const createdWorkouts = await Workout.create(workouts);
    console.log(`✅ ${createdWorkouts.length} programmes créés`);

    // 📝 CRÉER LES LOGS DE SÉANCES
    console.log('📝 Création des logs de séances...');
    
    const today = new Date();
    const logs = [];

    // Logs pour Anas (derniers 30 jours)
    for (let i = 0; i < 12; i++) {
      const logDate = new Date(today);
      logDate.setDate(logDate.getDate() - (i * 2.5)); // Une séance tous les 2-3 jours

      const workoutIndex = i % 3; // Rotation Push/Pull/Legs
      const workout = createdWorkouts[workoutIndex];

      logs.push({
        userId: createdUsers[0]._id,
        workoutId: workout._id,
        date: logDate,
        duree: 60 + Math.floor(Math.random() * 30), // 60-90 min
        notes: `Bonne séance ! Progression continue.`,
        exercices: workout.exercices.map(ex => ({
          exerciceId: ex.exerciceId,
          series: Array(ex.seriesCible).fill().map((_, index) => ({
            poids: 60 + Math.floor(Math.random() * 40), // 60-100 kg
            reps: ex.repsCible - Math.floor(index * 0.5) // Fatigue progressive
          }))
        }))
      });
    }

    // Logs pour Sarah (derniers 20 jours)
    for (let i = 0; i < 8; i++) {
      const logDate = new Date(today);
      logDate.setDate(logDate.getDate() - (i * 2.5));

      const workoutIndex = i % 2 === 0 ? 3 : 4; // Alterne Full Body et Cardio
      const workout = createdWorkouts[workoutIndex];

      logs.push({
        userId: createdUsers[1]._id,
        workoutId: workout._id,
        date: logDate,
        duree: 45 + Math.floor(Math.random() * 15), // 45-60 min
        notes: `Séance complétée avec succès !`,
        exercices: workout.exercices.map(ex => ({
          exerciceId: ex.exerciceId,
          series: Array(ex.seriesCible).fill().map(() => ({
            poids: 20 + Math.floor(Math.random() * 20),
            reps: ex.repsCible
          }))
        }))
      });
    }

    // Logs pour Omar (derniers 15 jours)
    for (let i = 0; i < 6; i++) {
      const logDate = new Date(today);
      logDate.setDate(logDate.getDate() - (i * 2.5));

      logs.push({
        userId: createdUsers[2]._id,
        workoutId: createdWorkouts[5]._id,
        date: logDate,
        duree: 90 + Math.floor(Math.random() * 20), // 90-110 min
        notes: `Entraînement intense, charge maximale`,
        exercices: createdWorkouts[5].exercices.map(ex => ({
          exerciceId: ex.exerciceId,
          series: Array(ex.seriesCible).fill().map(() => ({
            poids: 100 + Math.floor(Math.random() * 60), // 100-160 kg
            reps: ex.repsCible
          }))
        }))
      });
    }

    const createdLogs = await WorkoutLog.create(logs);
    console.log(`✅ ${createdLogs.length} logs de séances créés`);

    // 📊 CRÉER LES MESURES DE PROGRESSION
    console.log('📊 Création des mesures de progression...');
    
    const progressData = [];

    // Progression pour Anas (prise de muscle - 60 jours)
    for (let i = 0; i < 8; i++) {
      const progressDate = new Date(today);
      progressDate.setDate(progressDate.getDate() - (i * 7.5)); // Une mesure par semaine

      const poids = 75 + (8 - i) * 0.4; // Prise de 0.4kg par semaine
      const tailleEnMetres = 1.78;
      const imc = parseFloat((poids / (tailleEnMetres * tailleEnMetres)).toFixed(2));

      progressData.push({
        userId: createdUsers[0]._id,
        date: progressDate,
        poids: parseFloat(poids.toFixed(1)),
        imc,
        mensurations: {
          tourTaille: 82 + (8 - i) * 0.2,
          tourPoitrine: 98 + (8 - i) * 0.4,
          tourBras: 35 + (8 - i) * 0.15,
          tourCuisses: 58 + (8 - i) * 0.3
        }
      });
    }

    // Progression pour Sarah (perte de poids - 60 jours)
    for (let i = 0; i < 8; i++) {
      const progressDate = new Date(today);
      progressDate.setDate(progressDate.getDate() - (i * 7.5));

      const poids = 60 - (8 - i) * 0.5; // Perte de 0.5kg par semaine
      const tailleEnMetres = 1.65;
      const imc = parseFloat((poids / (tailleEnMetres * tailleEnMetres)).toFixed(2));

      progressData.push({
        userId: createdUsers[1]._id,
        date: progressDate,
        poids: parseFloat(poids.toFixed(1)),
        imc,
        mensurations: {
          tourTaille: 75 - (8 - i) * 0.3,
          tourPoitrine: 88 - (8 - i) * 0.2,
          tourBras: 28 - (8 - i) * 0.1,
          tourCuisses: 55 - (8 - i) * 0.2
        }
      });
    }

    // Progression pour Omar (maintien - 45 jours)
    for (let i = 0; i < 6; i++) {
      const progressDate = new Date(today);
      progressDate.setDate(progressDate.getDate() - (i * 7.5));

      const poids = 85 + Math.random() * 1 - 0.5; // Variations minimes
      const tailleEnMetres = 1.82;
      const imc = parseFloat((poids / (tailleEnMetres * tailleEnMetres)).toFixed(2));

      progressData.push({
        userId: createdUsers[2]._id,
        date: progressDate,
        poids: parseFloat(poids.toFixed(1)),
        imc,
        mensurations: {
          tourTaille: 85,
          tourPoitrine: 105,
          tourBras: 40,
          tourCuisses: 62
        }
      });
    }

    const createdProgress = await Progress.create(progressData);
    console.log(`✅ ${createdProgress.length} mesures de progression créées`);

    // 📊 RÉSUMÉ FINAL
    console.log('\n' + '='.repeat(50));
    console.log('🎉 SEED TERMINÉ AVEC SUCCÈS !');
    console.log('='.repeat(50));
    console.log(`👤 Utilisateurs: ${createdUsers.length}`);
    console.log(`💪 Exercices: ${createdExercises.length}`);
    console.log(`📋 Programmes: ${createdWorkouts.length}`);
    console.log(`📝 Logs de séances: ${createdLogs.length}`);
    console.log(`📊 Mesures de progression: ${createdProgress.length}`);
    console.log('='.repeat(50));
    console.log('\n📧 Comptes créés:');
    createdUsers.forEach(user => {
      console.log(`   - ${user.email} / password123`);
    });
    console.log('='.repeat(50) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
};

// 🗑️ FONCTION DE NETTOYAGE
const cleanDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🗑️  Nettoyage de la base de données...');
    await User.deleteMany({});
    await Exercise.deleteMany({});
    await Workout.deleteMany({});
    await WorkoutLog.deleteMany({});
    await Progress.deleteMany({});
    
    console.log('✅ Base de données nettoyée avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    process.exit(1);
  }
};

// 🚀 EXÉCUTION
const args = process.argv.slice(2);

if (args[0] === '--clean' || args[0] === '-c') {
  cleanDatabase();
} else {
  seedDatabase();
}