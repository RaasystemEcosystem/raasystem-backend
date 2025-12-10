<<<<<<< HEAD
// src/routes/rbt.js
const express = require('express');
const router = express.Router();
const rbtController = require('../controllers/rbtController');

router.get('/status', rbtController.status);
router.get('/', rbtController.listHoldings);
router.post('/mint', rbtController.mint);
router.post('/burn', rbtController.burn);
router.post('/adjust', rbtController.adjust);
router.get('/value', rbtController.value);
router.get('/composition', rbtController.composition);
router.post('/transfer', rbtController.transfer);
router.get('/supply', rbtController.supply);
router.post('/convert', rbtController.convertFromRAAS);
=======
const express = require('express');
const router = express.Router();

router.get('/status', (req, res) =>
  res.json({ message: "RBT route working" })
);
>>>>>>> ecca5b6 (Unified Backend clean production build)

module.exports = router;
