const express = require('express');
const router = express.Router();

router.get('/status', (req, res) =>
  res.json({ message: "RBT route working" })
);

module.exports = router;
