const express = require('express');
const router = express.Router();

router.get('/price', (req, res) =>
  res.json({ goldPrice: 2890 })
);

module.exports = router;
