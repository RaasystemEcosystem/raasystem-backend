// C:\Users\hp\Raasystem\raasystem-backend\server\routes\rrwaRoutes.js
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: RRWA
 *   description: RRWA API endpoints
 */

/**
 * @swagger
 * /api/rrwa:
 *   get:
 *     summary: Get all RRWA records
 *     tags: [RRWA]
 *     responses:
 *       200:
 *         description: List of RRWA records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   name:
 *                     type: string
 *                     example: "Sample RRWA"
 */
router.get('/rrwa', (req, res) => {
  res.json([{ id: "1", name: "Sample RRWA" }]);
});

/**
 * @swagger
 * /api/rrwa/{id}:
 *   get:
 *     summary: Get RRWA by ID
 *     tags: [RRWA]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: RRWA ID
 *     responses:
 *       200:
 *         description: RRWA record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 name:
 *                   type: string
 *                   example: "Sample RRWA"
 *       404:
 *         description: RRWA not found
 */
router.get('/rrwa/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id, name: "Sample RRWA" });
});

/**
 * @swagger
 * /api/rrwa:
 *   post:
 *     summary: Create a new RRWA record
 *     tags: [RRWA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New RRWA"
 *     responses:
 *       201:
 *         description: RRWA created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "2"
 *                 name:
 *                   type: string
 *                   example: "New RRWA"
 */
router.post('/rrwa', (req, res) => {
  const { name } = req.body;
  res.status(201).json({ id: "2", name });
});

/**
 * @swagger
 * /api/rrwa/{id}:
 *   put:
 *     summary: Update RRWA by ID
 *     tags: [RRWA]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated RRWA"
 *     responses:
 *       200:
 *         description: RRWA updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 name:
 *                   type: string
 *                   example: "Updated RRWA"
 *       404:
 *         description: RRWA not found
 */
router.put('/rrwa/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  res.json({ id, name });
});

/**
 * @swagger
 * /api/rrwa/{id}:
 *   delete:
 *     summary: Delete RRWA by ID
 *     tags: [RRWA]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: RRWA deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "RRWA deleted successfully"
 *       404:
 *         description: RRWA not found
 */
router.delete('/rrwa/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: "RRWA deleted successfully" });
});

module.exports = router;
