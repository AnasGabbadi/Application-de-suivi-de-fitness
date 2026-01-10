import request from 'supertest';
import express from 'express';
import exerciseRoutes from '../routes/exerciseRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import errorHandler from '../middleware/errorHandler.js';
import './setup.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use(errorHandler);

describe('Tests des exercices', () => {
  let token;
  let userId;
  let token2;
  let userId2;

  const userData = {
    nom: 'Test',
    prenom: 'User',
    email: 'test@test.com',
    password: '123456'
  };

  const userData2 = {
    nom: 'Test2',
    prenom: 'User2',
    email: 'test2@test.com',
    password: '123456'
  };

  const exerciseData = {
    nom: 'Pompes',
    description: 'Exercice au poids du corps',
    groupeMusculaire: 'Pectoraux',
    categorie: 'Force',
    difficulte: 'Débutant'
  };

  beforeEach(async () => {
    // Créer le premier utilisateur
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);
    token = response.body.token;
    userId = response.body.data._id;

    // Créer un deuxième utilisateur pour tester l'isolation
    const response2 = await request(app)
      .post('/api/auth/register')
      .send(userData2);
    token2 = response2.body.token;
    userId2 = response2.body.data._id;
  });

  describe('GET /api/exercises', () => {
    // ✅ AJOUT : Test d'authentification requise
    it('devrait rejeter sans authentification', async () => {
      const response = await request(app).get('/api/exercises');
      expect(response.status).toBe(401);
    });

    // ✅ MODIFIÉ : Ajouter le token
    it('devrait retourner une liste vide initialement', async () => {
      const response = await request(app)
        .get('/api/exercises')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    // ✅ MODIFIÉ : Ajouter le token dans la requête GET
    it('devrait filtrer par groupe musculaire', async () => {
      await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${token}`)
        .send(exerciseData);

      const response = await request(app)
        .get('/api/exercises?groupeMusculaire=Pectoraux')
        .set('Authorization', `Bearer ${token}`); // ✅ AJOUT

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });

    // ✅ NOUVEAU TEST : Isolation des données par utilisateur
    it('ne devrait retourner que les exercices de l\'utilisateur connecté', async () => {
      // User 1 crée un exercice
      await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${token}`)
        .send(exerciseData);

      // User 2 crée un exercice différent
      await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${token2}`)
        .send({ ...exerciseData, nom: 'Squats' });

      // User 1 ne doit voir que son exercice
      const response1 = await request(app)
        .get('/api/exercises')
        .set('Authorization', `Bearer ${token}`);

      expect(response1.status).toBe(200);
      expect(response1.body.data).toHaveLength(1);
      expect(response1.body.data[0].nom).toBe('Pompes');

      // User 2 ne doit voir que son exercice
      const response2 = await request(app)
        .get('/api/exercises')
        .set('Authorization', `Bearer ${token2}`);

      expect(response2.status).toBe(200);
      expect(response2.body.data).toHaveLength(1);
      expect(response2.body.data[0].nom).toBe('Squats');
    });
  });

  describe('POST /api/exercises', () => {
    it('devrait créer un nouvel exercice', async () => {
      const response = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${token}`)
        .send(exerciseData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.nom).toBe(exerciseData.nom);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data).toHaveProperty('createdBy'); // ✅ AJOUT
      expect(response.body.data.createdBy).toBe(userId); // ✅ AJOUT
    });

    it('devrait rejeter sans authentification', async () => {
      const response = await request(app)
        .post('/api/exercises')
        .send(exerciseData);

      expect(response.status).toBe(401);
    });

    it('devrait rejeter avec des données invalides', async () => {
      const response = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${token}`)
        .send({ nom: 'AB' }); // Nom trop court

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/exercises/:id', () => {
    // ✅ AJOUT : Test d'authentification requise
    it('devrait rejeter sans authentification', async () => {
      const createResponse = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${token}`)
        .send(exerciseData);
      
      const exerciceId = createResponse.body.data._id;

      const response = await request(app)
        .get(`/api/exercises/${exerciceId}`);

      expect(response.status).toBe(401);
    });

    // ✅ MODIFIÉ : Ajouter le token
    it('devrait retourner un exercice par ID', async () => {
      const createResponse = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${token}`)
        .send(exerciseData);

      const exerciceId = createResponse.body.data._id;

      const response = await request(app)
        .get(`/api/exercises/${exerciceId}`)
        .set('Authorization', `Bearer ${token}`); // ✅ AJOUT

      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(exerciceId);
    });

    // ✅ NOUVEAU TEST : Un utilisateur ne peut pas voir l'exercice d'un autre
    it('ne devrait pas retourner un exercice d\'un autre utilisateur', async () => {
      // User 1 crée un exercice
      const createResponse = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${token}`)
        .send(exerciseData);

      const exerciceId = createResponse.body.data._id;

      // User 2 essaie d'accéder à l'exercice de User 1
      const response = await request(app)
        .get(`/api/exercises/${exerciceId}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    // ✅ MODIFIÉ : Ajouter le token
    it('devrait retourner 404 pour un ID inexistant', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/exercises/${fakeId}`)
        .set('Authorization', `Bearer ${token}`); // ✅ AJOUT

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/exercises/:id', () => {
    it('devrait mettre à jour un exercice', async () => {
      const createResponse = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${token}`)
        .send(exerciseData);

      const exerciceId = createResponse.body.data._id;

      const response = await request(app)
        .put(`/api/exercises/${exerciceId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nom: 'Pompes modifiées' });

      expect(response.status).toBe(200);
      expect(response.body.data.nom).toBe('Pompes modifiées');
    });

    // ✅ NOUVEAU TEST : Un utilisateur ne peut pas modifier l'exercice d'un autre
    it('ne devrait pas permettre de modifier un exercice d\'un autre utilisateur', async () => {
      // User 1 crée un exercice
      const createResponse = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${token}`)
        .send(exerciseData);

      const exerciceId = createResponse.body.data._id;

      // User 2 essaie de modifier l'exercice de User 1
      const response = await request(app)
        .put(`/api/exercises/${exerciceId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ nom: 'Pompes modifiées' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/exercises/:id', () => {
    it('devrait supprimer un exercice', async () => {
      const createResponse = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${token}`)
        .send(exerciseData);

      const exerciceId = createResponse.body.data._id;

      const response = await request(app)
        .delete(`/api/exercises/${exerciceId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    // ✅ NOUVEAU TEST : Un utilisateur ne peut pas supprimer l'exercice d'un autre
    it('ne devrait pas permettre de supprimer un exercice d\'un autre utilisateur', async () => {
      // User 1 crée un exercice
      const createResponse = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${token}`)
        .send(exerciseData);

      const exerciceId = createResponse.body.data._id;

      // User 2 essaie de supprimer l'exercice de User 1
      const response = await request(app)
        .delete(`/api/exercises/${exerciceId}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/exercises - filtres avancés', () => {
    beforeEach(async () => {
      // Créer plusieurs exercices avec différentes catégories et difficultés
      const exercises = [
        {
          nom: 'Pompes',
          groupeMusculaire: 'Pectoraux',
          categorie: 'Force',
          difficulte: 'Débutant'
        },
        {
          nom: 'Squats',
          groupeMusculaire: 'Jambes',
          categorie: 'Force',
          difficulte: 'Intermédiaire'
        },
        {
          nom: 'Course',
          groupeMusculaire: 'Cardio',
          categorie: 'Cardio',
          difficulte: 'Débutant'
        }
      ];

      for (const exercise of exercises) {
        await request(app)
          .post('/api/exercises')
          .set('Authorization', `Bearer ${token}`)
          .send(exercise);
      }
    });

    // ✅ MODIFIÉ : Ajouter le token
    it('devrait filtrer par catégorie', async () => {
      const response = await request(app)
        .get('/api/exercises?categorie=Force')
        .set('Authorization', `Bearer ${token}`); // ✅ AJOUT

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
    });

    // ✅ MODIFIÉ : Ajouter le token
    it('devrait filtrer par difficulté', async () => {
      const response = await request(app)
        .get('/api/exercises?difficulte=Débutant')
        .set('Authorization', `Bearer ${token}`); // ✅ AJOUT

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
    });

    // ✅ MODIFIÉ : Ajouter le token
    it('devrait combiner plusieurs filtres', async () => {
      const response = await request(app)
        .get('/api/exercises?categorie=Force&difficulte=Débutant')
        .set('Authorization', `Bearer ${token}`); // ✅ AJOUT

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].nom).toBe('Pompes');
    });
  });

  describe('PUT /api/exercises/:id - cas d\'erreur', () => {
    it('devrait retourner 404 pour un exercice inexistant', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/exercises/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nom: 'Nouveau nom' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/exercises/:id - cas d\'erreur', () => {
    it('devrait retourner 404 pour un exercice inexistant', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/exercises/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});