import swaggerJsdoc from 'swagger-jsdoc';

import { config } from '../config/env.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SafeLanka API',
      version: '1.0.0',
      description: 'Smart Crime Advisor Backend API',
      contact: {
        name: 'SafeLanka Team',
        email: 'support@safelanka.lk'
      }
    },
    servers: [
      {
        url: `${config.appUrl}/api/v1`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);