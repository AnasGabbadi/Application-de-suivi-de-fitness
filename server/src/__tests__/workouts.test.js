import request from 'supertest';
import express from 'express';
import workoutRoutes from '../routes/workoutRoutes.js';
import exerciseRoutes from '../routes/exerciseRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import errorHandler from '../middleware/errorHandler.js';
import './setup.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);
app.use(errorHandler);

describe('Tests des programmes d\'entraînement', () => {
  let token;
  let exerciceId;

  beforeEach(async () => {
    const authResponse = await request(app)
      .post('/api/auth/register')
      .send({
        nom: 'Test',
        prenom: 'User',
        email: 'test@test.com',
        password: '123456'
      });
    token = authResponse.body.token;

    const exerciseResponse = await request(app)
      .post('/api/exercises')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nom: 'Pompes',
        groupeMusculaire: 'Pectoraux',
        categorie: 'Force',
        difficulte: 'Débutant'
      });
    exerciceId = exerciseResponse.body.data._id;
  });

  describe('POST /api/workouts', () => {
    it('devrait créer un nouveau programme', async () => {
      const response = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'Push Day',
          description: 'Programme pectoraux',
          exercices: [
            {
              exerciceId: exerciceId,
              seriesCible: 4,
              repsCible: 10,
              tempsRepos: 90
            }
          ]
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.nom).toBe('Push Day');
      expect(response.body.data.exercices).toHaveLength(1);
      expect(response.body.data.exercices[0].seriesCible).toBe(4);
    });

    it('devrait créer un programme avec plusieurs exercices', async () => {
      // Créer un deuxième exercice
      const exercise2Response = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'Développé couché',
          groupeMusculaire: 'Pectoraux'
        });
      const exerciceId2 = exercise2Response.body.data._id;

      const response = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'Full Push',
          exercices: [
            {
              exerciceId: exerciceId,
              seriesCible: 3,
              repsCible: 12
            },
            {
              exerciceId: exerciceId2,
              seriesCible: 4,
              repsCible: 8
            }
          ]
        });

      expect(response.status).toBe(201);
      expect(response.body.data.exercices).toHaveLength(2);
    });

    it('devrait rejeter un programme sans exercice', async () => {
      const response = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'Programme vide',
          exercices: []
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter un programme sans nom', async () => {
      const response = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          exercices: [{ exerciceId }]
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter sans authentification', async () => {
      const response = await request(app)
        .post('/api/workouts')
        .send({
          nom: 'Push Day',
          exercices: [{ exerciceId }]
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/workouts', () => {
    it('devrait retourner une liste vide initialement', async () => {
      const response = await request(app)
        .get('/api/workouts')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('devrait retourner mes programmes', async () => {
      await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'Push Day',
          exercices: [{ exerciceId }]
        });

      const response = await request(app)
        .get('/api/workouts')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].nom).toBe('Push Day');
    });

    it('devrait retourner seulement mes programmes (isolation)', async () => {
      // Créer un programme avec le premier utilisateur
      await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'Mon programme',
          exercices: [{ exerciceId }]
        });

      // Créer un autre utilisateur
      const user2Response = await request(app)
        .post('/api/auth/register')
        .send({
          nom: 'User',
          prenom: 'Two',
          email: 'user2@test.com',
          password: '123456'
        });
      const token2 = user2Response.body.token;

      // Récupérer les programmes du deuxième utilisateur
      const response = await request(app)
        .get('/api/workouts')
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(0); // Ne doit voir aucun programme
    });

    it('devrait rejeter sans authentification', async () => {
      const response = await request(app).get('/api/workouts');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/workouts/:id', () => {
    it('devrait retourner un programme par ID', async () => {
      const createResponse = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'Push Day',
          description: 'Programme complet',
          exercices: [
            {
              exerciceId: exerciceId,
              seriesCible: 4,
              repsCible: 10
            }
          ]
        });

      const workoutId = createResponse.body.data._id;

      const response = await request(app)
        .get(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(workoutId);
      expect(response.body.data.nom).toBe('Push Day');
      expect(response.body.data.exercices).toHaveLength(1);
    });

    it('devrait retourner 404 pour un ID inexistant', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/workouts/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter un ID invalide', async () => {
      const response = await request(app)
        .get('/api/workouts/invalid-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait empêcher de voir le programme d\'un autre utilisateur', async () => {
      // Créer un programme avec le premier utilisateur
      const createResponse = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'Mon programme',
          exercices: [{ exerciceId }]
        });
      const workoutId = createResponse.body.data._id;

      // Créer un autre utilisateur
      const user2Response = await request(app)
        .post('/api/auth/register')
        .send({
          nom: 'User',
          prenom: 'Two',
          email: 'user2@test.com',
          password: '123456'
        });
      const token2 = user2Response.body.token;

      // Essayer d'accéder au programme du premier utilisateur
      const response = await request(app)
        .get(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/workouts/:id', () => {
    it('devrait mettre à jour un programme', async () => {
      const createResponse = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'Push Day',
          description: 'Description initiale',
          exercices: [{ exerciceId }]
        });

      const workoutId = createResponse.body.data._id;

      const response = await request(app)
        .put(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'Push Day Modifié',
          description: 'Nouvelle description'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.nom).toBe('Push Day Modifié');
      expect(response.body.data.description).toBe('Nouvelle description');
    });

    it('devrait mettre à jour les exercices d\'un programme', async () => {
      const createResponse = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'Push Day',
          exercices: [
            {
              exerciceId: exerciceId,
              seriesCible: 3,
              repsCible: 10
            }
          ]
        });

      const workoutId = createResponse.body.data._id;

      const response = await request(app)
        .put(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          exercices: [
            {
              exerciceId: exerciceId,
              seriesCible: 5,
              repsCible: 12
            }
          ]
        });

      expect(response.status).toBe(200);
      expect(response.body.data.exercices[0].seriesCible).toBe(5);
      expect(response.body.data.exercices[0].repsCible).toBe(12);
    });

    it('devrait retourner 404 pour un ID inexistant', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/workouts/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nom: 'Nouveau nom' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('devrait empêcher de modifier le programme d\'un autre utilisateur', async () => {
      // Créer un programme avec le premier utilisateur
      const createResponse = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'Mon programme',
          exercices: [{ exerciceId }]
        });
      const workoutId = createResponse.body.data._id;

      // Créer un autre utilisateur
      const user2Response = await request(app)
        .post('/api/auth/register')
        .send({
          nom: 'User',
          prenom: 'Two',
          email: 'user2@test.com',
          password: '123456'
        });
      const token2 = user2Response.body.token;

      // Essayer de modifier le programme du premier utilisateur
      const response = await request(app)
        .put(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ nom: 'Nom modifié' });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter un ID invalide', async () => {
      const response = await request(app)
        .put('/api/workouts/invalid-id')
        .set('Authorization', `Bearer ${token}`)
        .send({ nom: 'Nouveau nom' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/workouts/:id', () => {
    it('devrait supprimer un programme', async () => {
      const createResponse = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'Push Day',
          exercices: [{ exerciceId }]
        });

      const workoutId = createResponse.body.data._id;

      const response = await request(app)
        .delete(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Programme supprimé avec succès');

      // Vérifier que le programme n'existe plus
      const getResponse = await request(app)
        .get(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getResponse.status).toBe(404);
    });

    it('devrait retourner 404 pour un ID inexistant', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/workouts/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('devrait empêcher de supprimer le programme d\'un autre utilisateur', async () => {
      // Créer un programme avec le premier utilisateur
      const createResponse = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'Mon programme',
          exercices: [{ exerciceId }]
        });
      const workoutId = createResponse.body.data._id;

      // Créer un autre utilisateur
      const user2Response = await request(app)
        .post('/api/auth/register')
        .send({
          nom: 'User',
          prenom: 'Two',
          email: 'user2@test.com',
          password: '123456'
        });
      const token2 = user2Response.body.token;

      // Essayer de supprimer le programme du premier utilisateur
      const response = await request(app)
        .delete(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter un ID invalide', async () => {
      const response = await request(app)
        .delete('/api/workouts/invalid-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});