import request from 'supertest';
import express from 'express';
import progressRoutes from '../routes/progressRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import errorHandler from '../middleware/errorHandler.js';
import './setup.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use(errorHandler);

describe('Tests de progression (Progress)', () => {
  let token;

  const userData = {
    nom: 'Test',
    prenom: 'User',
    email: 'test@test.com',
    password: '123456',
    poids: 75,
    taille: 175
  };

  beforeEach(async () => {
    const authResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);
    token = authResponse.body.token;
  });

  describe('POST /api/progress', () => {
    it('devrait ajouter une nouvelle mesure avec poids uniquement', async () => {
      const progressData = {
        poids: 76
      };

      const response = await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${token}`)
        .send(progressData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Mesure ajoutée avec succès');
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.poids).toBe(76);
      expect(response.body.data).toHaveProperty('imc');
      expect(response.body.data.imc).toBeCloseTo(24.82, 1); // 76 / (1.75^2)
    });

    it('devrait ajouter une mesure avec poids et mensurations', async () => {
      const progressData = {
        poids: 77,
        mensurations: {
          tourTaille: 85,
          tourPoitrine: 100,
          tourBras: 35,
          tourCuisses: 60
        }
      };

      const response = await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${token}`)
        .send(progressData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.poids).toBe(77);
      expect(response.body.data.mensurations.tourTaille).toBe(85);
      expect(response.body.data.mensurations.tourPoitrine).toBe(100);
      expect(response.body.data.mensurations.tourBras).toBe(35);
      expect(response.body.data.mensurations.tourCuisses).toBe(60);
    });

    it('devrait ajouter une mesure avec seulement des mensurations', async () => {
      const progressData = {
        mensurations: {
          tourTaille: 82,
          tourPoitrine: 98
        }
      };

      const response = await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${token}`)
        .send(progressData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.mensurations.tourTaille).toBe(82);
    });

    it('devrait ajouter une mesure avec une date personnalisée', async () => {
      const customDate = new Date('2026-01-01').toISOString();
      const progressData = {
        poids: 78,
        date: customDate
      };

      const response = await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${token}`)
        .send(progressData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(new Date(response.body.data.date).toISOString()).toBe(customDate);
    });

    it('devrait rejeter un poids trop faible', async () => {
      const response = await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${token}`)
        .send({ poids: 20 }); // Moins de 30 kg

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter un poids trop élevé', async () => {
      const response = await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${token}`)
        .send({ poids: 350 }); // Plus de 300 kg

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter un tour de taille invalide', async () => {
      const response = await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${token}`)
        .send({
          poids: 75,
          mensurations: {
            tourTaille: 30 // Moins de 40 cm
          }
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter un tour de poitrine invalide', async () => {
      const response = await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${token}`)
        .send({
          poids: 75,
          mensurations: {
            tourPoitrine: 250 // Plus de 200 cm
          }
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter sans authentification', async () => {
      const response = await request(app)
        .post('/api/progress')
        .send({ poids: 76 });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/progress', () => {
    beforeEach(async () => {
      // Créer 3 mesures de test
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/api/progress')
          .set('Authorization', `Bearer ${token}`)
          .send({
            poids: 75 + i,
            mensurations: {
              tourTaille: 85 - i
            }
          });
      }
    });

    it('devrait retourner toutes mes mesures', async () => {
      const response = await request(app)
        .get('/api/progress')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0]).toHaveProperty('_id');
      expect(response.body.data[0]).toHaveProperty('date');
    });

    it('devrait retourner les mesures triées par date (plus récente en premier)', async () => {
      const response = await request(app)
        .get('/api/progress')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      const dates = response.body.data.map(p => new Date(p.date).getTime());
      
      // Vérifier que les dates sont triées en ordre décroissant
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
      }
    });

    it('devrait retourner une liste vide pour un nouvel utilisateur', async () => {
      const newUserResponse = await request(app)
        .post('/api/auth/register')
        .send({
          nom: 'New',
          prenom: 'User',
          email: 'newuser@test.com',
          password: '123456'
        });

      const response = await request(app)
        .get('/api/progress')
        .set('Authorization', `Bearer ${newUserResponse.body.token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(0);
    });

    it('devrait rejeter sans authentification', async () => {
      const response = await request(app).get('/api/progress');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/progress/latest', () => {
    it('devrait retourner la dernière mesure', async () => {
      // Créer 3 mesures
      await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${token}`)
        .send({ poids: 75 });

      await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${token}`)
        .send({ poids: 76 });

      await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${token}`)
        .send({ poids: 77 });

      const response = await request(app)
        .get('/api/progress/latest')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.poids).toBe(77); // La dernière mesure
    });

    it('devrait retourner 404 si aucune mesure n\'existe', async () => {
      const newUserResponse = await request(app)
        .post('/api/auth/register')
        .send({
          nom: 'New',
          prenom: 'User',
          email: 'newuser@test.com',
          password: '123456'
        });

      const response = await request(app)
        .get('/api/progress/latest')
        .set('Authorization', `Bearer ${newUserResponse.body.token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Aucune mesure trouvée');
    });
  });

  describe('DELETE /api/progress/:id', () => {
    it('devrait supprimer une mesure', async () => {
      const createResponse = await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${token}`)
        .send({ poids: 76 });

      const progressId = createResponse.body.data._id;

      const response = await request(app)
        .delete(`/api/progress/${progressId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Mesure supprimée avec succès');

      // Vérifier que la mesure n'existe plus
      const getResponse = await request(app)
        .get('/api/progress')
        .set('Authorization', `Bearer ${token}`);

      expect(getResponse.body.count).toBe(0);
    });

    it('devrait retourner 404 pour un ID inexistant', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/progress/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('devrait empêcher de supprimer la mesure d\'un autre utilisateur', async () => {
      // Créer une mesure avec le premier utilisateur
      const createResponse = await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${token}`)
        .send({ poids: 76 });

      const progressId = createResponse.body.data._id;

      // Créer un autre utilisateur
      const newUserResponse = await request(app)
        .post('/api/auth/register')
        .send({
          nom: 'Other',
          prenom: 'User',
          email: 'other@test.com',
          password: '123456'
        });

      // Tenter de supprimer la mesure du premier utilisateur
      const response = await request(app)
        .delete(`/api/progress/${progressId}`)
        .set('Authorization', `Bearer ${newUserResponse.body.token}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter un ID invalide', async () => {
      const response = await request(app)
        .delete('/api/progress/invalid-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Calcul automatique de l\'IMC', () => {
    it('devrait calculer l\'IMC automatiquement', async () => {
      // Utilisateur avec taille 175 cm, poids 75 kg
      // IMC attendu = 75 / (1.75^2) = 24.49
      const response = await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${token}`)
        .send({ poids: 75 });

      expect(response.status).toBe(201);
      expect(response.body.data.imc).toBeDefined();
      expect(response.body.data.imc).toBeCloseTo(24.49, 1);
    });

    it('devrait recalculer l\'IMC avec un nouveau poids', async () => {
      // Poids 80 kg, taille 175 cm
      // IMC attendu = 80 / (1.75^2) = 26.12
      const response = await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${token}`)
        .send({ poids: 80 });

      expect(response.status).toBe(201);
      expect(response.body.data.imc).toBeCloseTo(26.12, 1);
    });
  });

    describe('GET /api/progress - avec pagination', () => {
    beforeEach(async () => {
      // Créer 5 mesures
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/progress')
          .set('Authorization', `Bearer ${token}`)
          .send({ poids: 75 + i });
      }
    });

    it('devrait retourner toutes les mesures triées', async () => {
      const response = await request(app)
        .get('/api/progress')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(5);
      expect(response.body.data.length).toBe(5);
    });
  });

  describe('DELETE /api/progress/:id - cas d\'erreur', () => {
    it('devrait retourner 404 pour une mesure inexistante', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/progress/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/progress - calcul IMC avec différentes tailles', () => {
    it('devrait calculer l\'IMC pour différentes tailles', async () => {
      // Modifier la taille de l'utilisateur
      const User = (await import('../models/User.js')).default;
      await User.findOneAndUpdate(
        { email: userData.email },
        { taille: 180 }
      );

      const response = await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${token}`)
        .send({ poids: 80 });

      expect(response.status).toBe(201);
      expect(response.body.data.imc).toBeCloseTo(24.69, 1); // 80 / (1.80^2)
    });
  });
});