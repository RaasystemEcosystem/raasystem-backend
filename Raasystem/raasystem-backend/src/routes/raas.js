<<<<<<< HEAD
// src/routes/raas.js
const express = require('express');
const router = express.Router();
const raasController = require('../controllers/raasController');

router.get('/price', raasController.price);
router.post('/mint', raasController.mint);
router.post('/burn', raasController.burn);
=======
const express = require('express');
const router = express.Router();

// Example endpoint: Raasystem status
router.get('/status', (req, res) => {
  res.json({ message: "✅ Raasystem route working" });
});

// Example endpoint: System info
router.get('/info', (req, res) => {
  res.json({
    system: "Raasystem Unified Backend",
    version: "1.0.0",
    time: new Date()
  });
});
>>>>>>> ecca5b6 (Unified Backend clean production build)

module.exports = router;
