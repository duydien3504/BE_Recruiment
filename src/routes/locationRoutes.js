const express = require('express');
const router = express.Router();
const LocationController = require('../controllers/LocationController');

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: Quản lý địa điểm
 */

/**
 * @swagger
 * /api/v1/locations:
 *   get:
 *     summary: Lấy danh sách địa điểm (Public)
 *     tags: [Locations]
 *     description: Lấy danh sách tất cả các tỉnh/thành phố.
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách địa điểm thành công."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       locationId:
 *                         type: integer
 *                       name:
 *                         type: string
 */
router.get('/', LocationController.getAllLocations);

module.exports = router;
