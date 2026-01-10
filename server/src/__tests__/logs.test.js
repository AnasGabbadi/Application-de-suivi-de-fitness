import request from 'supertest';
import express from 'express';
import logRoutes from '../routes/logRoutes.js';
import exerciseRoutes from '../routes/exerciseRoutes.js';
import workoutRoutes from '../routes/workoutRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import errorHandler from '../middleware/errorHandler.js';
import './setup.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/logs', logRoutes);
app.use(errorHandler);

describe('Tests des séances d\'entraînement (Logs)', () => {
  let token;
  let exerciceId;
  let workoutId;

  const userData = {
    nom: 'Test',
    prenom: 'User',
    email: 'test@test.com',
    password: '123456'
  };

  beforeEach(async () => {
    // Créer un utilisateur
    const authResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);
    token = authResponse.body.token;

    // Créer un exercice
    const exerciseResponse = await request(app)
      .post('/api/exercises')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nom: 'Développé couché',
        description: 'Exercice de base pour les pectoraux',
        groupeMusculaire: 'Pectoraux',
        categorie: 'Force',
        difficulte: 'Intermédiaire'
      });
    exerciceId = exerciseResponse.body.data._id;

    // Créer un programme
    const workoutResponse = await request(app)
      .post('/api/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nom: 'Push Day',
        description: 'Programme pectoraux/épaules/triceps',
        exercices: [
          {
            exerciceId: exerciceId,
            seriesCible: 4,
            repsCible: 10,
            tempsRepos: 90
          }
        ]
      });
    workoutId = workoutResponse.body.data._id;
  });

  describe('POST /api/logs', () => {
    it('devrait créer une nouvelle séance', async () => {
      const logData = {
        workoutId: workoutId,
        duree: 60,
        notes: 'Bonne séance !',
        exercices: [
          {
            exerciceId: exerciceId,
            series: [
              { poids: 80, reps: 10 },
              { poids: 80, reps: 9 },
              { poids: 80, reps: 8 },
              { poids: 80, reps: 7 }
            ]
          }
        ]
      };

      const response = await request(app)
        .post('/api/logs')
        .set('Authorization', `Bearer ${token}`)
        .send(logData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Séance enregistrée avec succès');
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.duree).toBe(60);
      expect(response.body.data.exercices).toHaveLength(1);
      expect(response.body.data.exercices[0].series).toHaveLength(4);
    });

    it('devrait créer une séance sans programme associé', async () => {
      const logData = {
        duree: 45,
        notes: 'Séance improvisée',
        exercices: [
          {
            exerciceId: exerciceId,
            series: [
              { poids: 60, reps: 12 },
              { poids: 60, reps: 12 }
            ]
          }
        ]
      };

      const response = await request(app)
        .post('/api/logs')
        .set('Authorization', `Bearer ${token}`)
        .send(logData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('devrait rejeter une séance sans exercices', async () => {
      const response = await request(app)
        .post('/api/logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          duree: 30,
          exercices: []
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter une durée invalide', async () => {
      const response = await request(app)
        .post('/api/logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          duree: 700, // Plus de 600 minutes
          exercices: [
            {
              exerciceId: exerciceId,
              series: [{ poids: 80, reps: 10 }]
            }
          ]
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter des répétitions invalides', async () => {
      const response = await request(app)
        .post('/api/logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          duree: 60,
          exercices: [
            {
              exerciceId: exerciceId,
              series: [{ poids: 80, reps: 0 }] // Reps invalide
            }
          ]
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter un poids trop élevé', async () => {
      const response = await request(app)
        .post('/api/logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          duree: 60,
          exercices: [
            {
              exerciceId: exerciceId,
              series: [{ poids: 600, reps: 10 }] // Plus de 500 kg
            }
          ]
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter sans authentification', async () => {
      const response = await request(app)
        .post('/api/logs')
        .send({
          duree: 60,
          exercices: [
            {
              exerciceId: exerciceId,
              series: [{ poids: 80, reps: 10 }]
            }
          ]
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/logs', () => {
    beforeEach(async () => {
      // Créer 3 séances de test
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/api/logs')
          .set('Authorization', `Bearer ${token}`)
          .send({
            duree: 60 + i * 10,
            notes: `Séance ${i + 1}`,
            exercices: [
              {
                exerciceId: exerciceId,
                series: [{ poids: 80, reps: 10 }]
              }
            ]
          });
      }
    });

    it('devrait retourner toutes mes séances', async () => {
      const response = await request(app)
        .get('/api/logs')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0]).toHaveProperty('_id');
      expect(response.body.data[0]).toHaveProperty('date');
    });

    it('devrait retourner une liste vide pour un nouvel utilisateur', async () => {
      // Créer un autre utilisateur
      const newUserResponse = await request(app)
        .post('/api/auth/register')
        .send({
          nom: 'New',
          prenom: 'User',
          email: 'newuser@test.com',
          password: '123456'
        });

      const response = await request(app)
        .get('/api/logs')
        .set('Authorization', `Bearer ${newUserResponse.body.token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(0);
    });

    it('devrait rejeter sans authentification', async () => {
      const response = await request(app).get('/api/logs');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/logs/:id', () => {
    it('devrait retourner une séance par ID', async () => {
      const createResponse = await request(app)
        .post('/api/logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          duree: 60,
          exercices: [
            {
              exerciceId: exerciceId,
              series: [
                { poids: 80, reps: 10 },
                { poids: 80, reps: 9 }
              ]
            }
          ]
        });

      const logId = createResponse.body.data._id;

      const response = await request(app)
        .get(`/api/logs/${logId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(logId);
      expect(response.body.data.exercices[0].series).toHaveLength(2);
    });

    it('devrait retourner 404 pour un ID inexistant', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/logs/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter un ID invalide', async () => {
      const response = await request(app)
        .get('/api/logs/invalid-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/logs/:id', () => {
    it('devrait mettre à jour une séance', async () => {
      const createResponse = await request(app)
        .post('/api/logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          duree: 60,
          notes: 'Notes initiales',
          exercices: [
            {
              exerciceId: exerciceId,
              series: [{ poids: 80, reps: 10 }]
            }
          ]
        });

      const logId = createResponse.body.data._id;

      const response = await request(app)
        .put(`/api/logs/${logId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          duree: 75,
          notes: 'Notes modifiées'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.duree).toBe(75);
      expect(response.body.data.notes).toBe('Notes modifiées');
    });

    it('devrait empêcher de modifier la séance d\'un autre utilisateur', async () => {
      // Créer une séance avec le premier utilisateur
      const createResponse = await request(app)
        .post('/api/logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          duree: 60,
          exercices: [
            {
              exerciceId: exerciceId,
              series: [{ poids: 80, reps: 10 }]
            }
          ]
        });

      const logId = createResponse.body.data._id;

      // Créer un autre utilisateur
      const newUserResponse = await request(app)
        .post('/api/auth/register')
        .send({
          nom: 'Other',
          prenom: 'User',
          email: 'other@test.com',
          password: '123456'
        });

      // Tenter de modifier la séance du premier utilisateur
      const response = await request(app)
        .put(`/api/logs/${logId}`)
        .set('Authorization', `Bearer ${newUserResponse.body.token}`)
        .send({ duree: 90 });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/logs/:id', () => {
    it('devrait supprimer une séance', async () => {
      const createResponse = await request(app)
        .post('/api/logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          duree: 60,
          exercices: [
            {
              exerciceId: exerciceId,
              series: [{ poids: 80, reps: 10 }]
            }
          ]
        });

      const logId = createResponse.body.data._id;

      const response = await request(app)
        .delete(`/api/logs/${logId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Séance supprimée avec succès');

      // Vérifier que la séance n'existe plus
      const getResponse = await request(app)
        .get(`/api/logs/${logId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getResponse.status).toBe(404);
    });

    it('devrait empêcher de supprimer la séance d\'un autre utilisateur', async () => {
      const createResponse = await request(app)
        .post('/api/logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          duree: 60,
          exercices: [
            {
              exerciceId: exerciceId,
              series: [{ poids: 80, reps: 10 }]
            }
          ]
        });

      const logId = createResponse.body.data._id;

      const newUserResponse = await request(app)
        .post('/api/auth/register')
        .send({
          nom: 'Other',
          prenom: 'User',
          email: 'other@test.com',
          password: '123456'
        });

      const response = await request(app)
        .delete(`/api/logs/${logId}`)
        .set('Authorization', `Bearer ${newUserResponse.body.token}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/logs/stats/me', () => {
    beforeEach(async () => {
      // Créer plusieurs séances avec différentes durées
      await request(app)
        .post('/api/logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          duree: 60,
          exercices: [
            {
              exerciceId: exerciceId,
              series: [{ poids: 80, reps: 10 }]
            }
          ]
        });

      await request(app)
        .post('/api/logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          duree: 90,
          exercices: [
            {
              exerciceId: exerciceId,
              series: [{ poids: 85, reps: 8 }]
            }
          ]
        });
    });

    it('devrait retourner les statistiques de mes séances', async () => {
      const response = await request(app)
        .get('/api/logs/stats/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalSeances');
      expect(response.body.data).toHaveProperty('totalDuree');
      expect(response.body.data).toHaveProperty('moyenneDuree');
      expect(response.body.data.totalSeances).toBe(2);
      expect(response.body.data.totalDuree).toBe(150); // 60 + 90
      expect(response.body.data.moyenneDuree).toBe(75); // (60 + 90) / 2
    });
  });

    describe('GET /api/logs - filtres par date', () => {
    beforeEach(async () => {
      // Créer des logs à différentes dates
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);

      await request(app)
        .post('/api/logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          duree: 60,
          date: today.toISOString(),
          exercices: [
            {
              exerciceId: exerciceId,
              series: [{ poids: 80, reps: 10 }]
            }
          ]
        });

      await request(app)
        .post('/api/logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          duree: 60,
          date: yesterday.toISOString(),
          exercices: [
            {
              exerciceId: exerciceId,
              series: [{ poids: 80, reps: 10 }]
            }
          ]
        });
    });

    it('devrait retourner les logs avec populate des exercices', async () => {
      const response = await request(app)
        .get('/api/logs')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data[0].exercices[0]).toHaveProperty('exerciceId');
    });
  });

  describe('PUT /api/logs/:id - cas d\'erreur', () => {
    it('devrait retourner 404 pour un log inexistant', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/logs/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ duree: 90 });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/logs/:id - cas d\'erreur', () => {
    it('devrait retourner 404 pour un log inexistant', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/logs/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});