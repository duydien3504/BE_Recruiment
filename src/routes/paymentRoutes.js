const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Quản lý thanh toán
 */

/**
 * @swagger
 * /api/v1/payments/create:
 *   post:
 *     summary: Tạo link thanh toán VNPay
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobPostId
 *             properties:
 *               jobPostId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Tạo link thành công
 */
router.post('/create', authenticateToken, PaymentController.createPayment);

/**
 * @swagger
 * /api/v1/payments/callback:
 *   get:
 *     summary: Callback từ VNPay
 *     tags: [Payments]
 *     description: Endpoint nhận kết quả thanh toán từ VNPay
 *     responses:
 *       302:
 *         description: Redirect về trang kết quả
 */
router.get('/callback', PaymentController.handleCallback);

/**
 * @swagger
 * /api/v1/payments/test-success:
 *   post:
 *     summary: Test payment success (Development only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionId
 *             properties:
 *               transactionId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Test thành công
 */
router.post('/test-success', authenticateToken, PaymentController.testPaymentSuccess);

module.exports = router;
