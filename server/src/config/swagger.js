import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fitness Tracker API',
      version: '1.0.0',
      description: 'API REST pour application de suivi de fitness (MERN Stack)',
      contact: {
        name: 'GABBADI Anas',
        email: 'anas@fitnesstracker.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur de développement'
      },
      {
        url: 'https://api.fitnesstracker.com',
        description: 'Serveur de production (optionnel)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Entrez votre token JWT'
        }
      },
      schemas: {
        // Schémas des modèles (à définir après)
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/models/*.js'] // Chemins vers les fichiers à documenter
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;