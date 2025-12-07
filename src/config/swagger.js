const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

// Load swagger.json from the docs folder
const swaggerPath = path.join(__dirname, '../docs/swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

module.exports = {
  swaggerUi,
  swaggerDocument
};
