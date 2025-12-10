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

module.exports = router;
