// C:\Users\hp\Raasystem\raasystem-backend\server\index.js
require('dotenv').config();
const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const rrwaRoutes = require('./routes/rrwaRoutes');

const app = express();

// Middleware
app.use(express.json());

// Swagger Configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Raasystem Backend API',
      version: '1.0.0',
      description: 'API documentation for Raasystem backend',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./server/routes/*.js'], // path to route files
};

// Initialize Swagger docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get('/swagger.json', (req, res) => res.json(swaggerDocs));

// Mount routes
app.use('/api', rrwaRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send('✅ Raasystem Backend API is running. Visit /api-docs for Swagger UI.');
});
app.listen(PORT, () => {
  console.log(`🚀 Raasystem backend running on port ${PORT}`);
  console.log(`📊 Swagger docs available at http://localhost:${PORT}/api-docs`);
});
