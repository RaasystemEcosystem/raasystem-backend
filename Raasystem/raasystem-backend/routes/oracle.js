const express = require('express');
const router = express.Router();
const oracleController = require('../controllers/oracleController');

router.get('/gold-price', oracleController.getGoldPrice);

module.exports = router;
