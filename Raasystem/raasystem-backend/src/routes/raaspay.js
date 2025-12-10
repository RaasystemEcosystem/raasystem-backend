const express = require('express');
const router = express.Router();

router.post('/pay', (req, res) =>
  res.json({ status: "Payment endpoint active" })
);

module.exports = router;
