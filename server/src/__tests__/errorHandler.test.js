import errorHandler from '../middleware/errorHandler.js';
import { jest } from '@jest/globals';

describe('Tests du middleware errorHandler', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Masquer console.error pour les tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('devrait gérer les erreurs de validation Mongoose', () => {
    const err = {
      name: 'ValidationError',
      message: 'Validation failed',
      stack: 'Error stack',
      errors: {
        email: { message: 'Email invalide' },
        password: { message: 'Mot de passe requis' }
      }
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Erreur de validation',
      errors: ['Email invalide', 'Mot de passe requis']
    });
  });

  it('devrait gérer les erreurs de clé dupliquée (E11000)', () => {
    const err = {
      name: 'MongoError',
      code: 11000,
      message: 'E11000 duplicate key error',
      stack: 'Error stack'
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Cette valeur existe déjà'
    });
  });

  it('devrait gérer les erreurs de cast MongoDB (ID invalide)', () => {
    const err = {
      name: 'CastError',
      message: 'Cast to ObjectId failed',
      stack: 'Error stack',
      kind: 'ObjectId',
      value: 'invalid-id'
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Ressource non trouvée'
    });
  });

  it('devrait gérer les erreurs génériques', () => {
    const err = {
      message: 'Une erreur est survenue',
      stack: 'Error stack'
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Une erreur est survenue'
    });
  });

  it('devrait utiliser un message par défaut si aucun message', () => {
    const err = {
      stack: 'Error stack'
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Erreur serveur'
    });
  });

  it('devrait gérer les erreurs avec un statut personnalisé', () => {
    const err = {
      message: 'Accès refusé',
      stack: 'Error stack',
      statusCode: 403
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Accès refusé'
    });
  });

  it('devrait gérer les erreurs sans stack trace', () => {
    const err = {
      message: 'Erreur simple'
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Erreur simple'
    });
  });
});