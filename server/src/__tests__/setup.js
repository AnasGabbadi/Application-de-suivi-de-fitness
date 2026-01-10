import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Charger les variables d'environnement de test
dotenv.config({ path: '.env.test' });

// Variable pour tracker si on est déjà connecté
let isConnected = false;

// Se connecter à la base de données de test avant tous les tests
beforeAll(async () => {
  try {
    if (!isConnected) {
      await mongoose.connect(process.env.MONGO_URI);
      isConnected = true;
    }
    
    // Nettoyer toutes les collections au démarrage
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error);
    throw error;
  }
});

// Nettoyer TOUTES les collections après chaque test
afterEach(async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    throw error;
  }
});

// Fermer la connexion après tous les tests (seulement en mode normal)
afterAll(async () => {
  try {
    // Nettoyer une dernière fois
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    
    // Fermer la connexion seulement si on n'est pas en mode watch
    if (process.env.JEST_WATCH !== 'true') {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      isConnected = false;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la fermeture:', error);
  }
});