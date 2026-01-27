const express = require('express');
const router = express.Router();
const FollowController = require('../controllers/FollowController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Follows
 *   description: Quản lý theo dõi công ty
 */

/**
 * @swagger
 * /api/v1/follows:
 *   post:
 *     summary: Theo dõi công ty (Follow Company)
 *     tags: [Follows]
 *     description: Follow công ty để nhận thông báo job mới.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *             properties:
 *               companyId:
 *                 type: string
 *                 example: "company-uuid-123"
 *     responses:
 *       201:
 *         description: Follow thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đã theo dõi công ty."
 *       400:
 *         description: Thiếu thông tin hoặc đã follow rồi
 *       404:
 *         description: Công ty không tồn tại
 *       401:
 *         description: Chưa đăng nhập
 */
router.post('/', authenticateToken, FollowController.followCompany);

/**
 * @swagger
 * /api/v1/follows:
 *   get:
 *     summary: Danh sách công ty đang theo dõi
 *     tags: [Follows]
 *     description: Lấy danh sách các công ty mà user đang theo dõi.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách công ty đang theo dõi thành công."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                       companyId:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       company:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           logoUrl:
 *                             type: string
 *                           scale:
 *                             type: string
 *                           websiteUrl:
 *                             type: string
 *                           addressDetail:
 *                             type: string
 *       401:
 *         description: Chưa đăng nhập
 */
router.get('/', authenticateToken, FollowController.getFollowedCompanies);

/**
 * @swagger
 * /api/v1/follows/{companyId}:
 *   delete:
 *     summary: Bỏ theo dõi công ty (Unfollow Company)
 *     tags: [Follows]
 *     description: Hủy theo dõi một công ty.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Bỏ theo dõi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đã bỏ theo dõi công ty."
 *       404:
 *         description: Chưa theo dõi công ty này
 *       401:
 *         description: Chưa đăng nhập
 */
router.delete('/:companyId', authenticateToken, FollowController.unfollowCompany);

module.exports = router;
