import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from '../routes/authRoutes.js';
import errorHandler from '../middleware/errorHandler.js';
import './setup.js';

// Configuration de l'app pour les tests
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

describe('Tests d\'authentification', () => {
  const userData = {
    nom: 'Test',
    prenom: 'User',
    email: 'test@test.com',
    password: '123456',
    age: 25,
    poids: 75,
    taille: 175,
    objectif: 'prise_masse'
  };

  describe('POST /api/auth/register', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Inscription réussie');
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body).toHaveProperty('token');
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('devrait rejeter un email invalide', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...userData, email: 'invalid-email' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter un mot de passe trop court', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...userData, password: '123' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter un email déjà utilisé', async () => {
      await request(app).post('/api/auth/register').send(userData);
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter des champs manquants', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@test.com' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(userData);
    });

    it('devrait connecter un utilisateur avec des identifiants valides', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Connexion réussie');
      expect(response.body).toHaveProperty('token');
      expect(response.body.data.email).toBe(userData.email);
    });

    it('devrait rejeter un email incorrect', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@test.com',
          password: userData.password
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter un mot de passe incorrect', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let token;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);
      token = response.body.token;
    });

    it('devrait retourner le profil avec un token valide', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(userData.email);
    });

    it('devrait rejeter sans token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter avec un token invalide', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

    describe('GET /api/auth/me - cas supplémentaires', () => {
    it('devrait gérer un token avec un utilisateur inexistant', async () => {
      // Créer un utilisateur et récupérer son token
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);
      const token = response.body.token;

      // Supprimer l'utilisateur de la base de données
      const User = (await import('../models/User.js')).default;
      await User.deleteMany({ email: userData.email });

      // Essayer d'accéder au profil avec le token
      const meResponse = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      // Le middleware auth vérifie d'abord le token, puis l'existence de l'utilisateur
      // Si l'utilisateur n'existe pas, il retourne 401 (non autorisé)
      expect(meResponse.status).toBe(401);
      expect(meResponse.body.success).toBe(false);
    });

    it('devrait retourner 401 avec un format de token incorrect', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'InvalidFormat');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});