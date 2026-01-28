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

module.exports = router;
