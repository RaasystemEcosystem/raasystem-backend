// src/routes/raas.js
const express = require('express');
const router = express.Router();
const raasController = require('../controllers/raasController');

router.get('/price', raasController.price);
router.post('/mint', raasController.mint);
router.post('/burn', raasController.burn);

module.exports = router;
