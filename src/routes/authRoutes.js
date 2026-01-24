const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { validateRegister } = require('../validators/authValidator');

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - full_name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               full_name:
 *                 type: string            
 *           example:
 *             email: "user@example.com"
 *             password: "Password123"
 *             full_name: "Nguyen Van A"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       409:
 *         description: Email đã tồn tại
 */
router.post('/register', validateRegister, AuthController.register);

module.exports = router;
