const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Quản lý thanh toán và giao dịch
 */

/**
 * @swagger
 * /api/v1/payments/history:
 *   get:
 *     summary: Lấy lịch sử giao dịch (Dành cho Employer)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng item mỗi trang
 *     responses:
 *       200:
 *         description: Thành công
 *       403:
 *         description: Không có quyền truy cập
 */
router.get('/history', authenticateToken, authorize(['Employer', 'Company']), PaymentController.getHistory);

/**
 * @swagger
 * /api/v1/payments/create-payment:
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
 */
router.post('/create-payment', authenticateToken, authorize(['Employer', 'Company']), PaymentController.createPayment);

/**
 * @swagger
 * /api/v1/payments/callback:
 *   get:
 *     summary: Xử lý callback từ VNPay (Return URL)
 *     tags: [Payments]
 */
router.get('/callback', PaymentController.handleCallback);

/**
 * @swagger
 * /api/v1/payments/ipn:
 *   get:
 *     summary: Xử lý IPN từ VNPay (Instant Payment Notification)
 *     tags: [Payments]
 */
router.get('/ipn', PaymentController.handleIPN);

module.exports = router;
