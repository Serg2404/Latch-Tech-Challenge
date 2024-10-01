// config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Basic Swagger configuration
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Your Project API Documentation',
    version: '1.0.0',
    description: 'This is a REST API application made with Express and MongoDB',
  },
  servers: [
    {
      url: 'http://localhost:5000', // Your server URL
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to your API route files
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
