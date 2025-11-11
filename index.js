const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Raasystem Backend is running!');
});

// ------------------------------
// Swagger Setup
// ------------------------------
const swaggerFilePath = path.join(__dirname, 'src', 'docs', 'swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ------------------------------
// Start server
// ------------------------------
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api/docs`);
});
