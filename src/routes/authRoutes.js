const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const {
    validateRegister,
    validateEmployerRegister,
    validateEmployerPaymentCallback,
    validateLogin,
    validateForgotPassword,
    validateVerifyOtp,
    validateRefreshToken
} = require('../validators/authValidator');

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

/**
 * @swagger
 * /api/v1/auth/employer/register:
 *   post:
 *     summary: Đăng ký tài khoản nhà tuyển dụng và tạo link thanh toán kích hoạt
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
 *               - fullName
 *               - companyName
 *               - taxCode
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               fullName:
 *                 type: string
 *               companyName:
 *                 type: string
 *               taxCode:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *           example:
 *             email: "hr@congty.com"
 *             password: "Password123"
 *             fullName: "Nguyen Van A"
 *             companyName: "Tech Company"
 *             taxCode: "0123456789"
 *             phoneNumber: "0987654321"
 *     responses:
 *       200:
 *         description: Khởi tạo đăng ký thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc email/taxCode đã tồn tại
 *       500:
 *         description: Lỗi hệ thống hoặc cổng thanh toán
 */
router.post('/employer/register', validateEmployerRegister, AuthController.registerEmployer);

/**
 * @swagger
 * /api/v1/auth/employer/payment-callback:
 *   get:
 *     summary: Callback thanh toán kích hoạt tài khoản nhà tuyển dụng
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: vnp_TxnRef
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_ResponseCode
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_SecureHash
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xử lý callback thành công
 *       400:
 *         description: Chữ ký không hợp lệ hoặc dữ liệu callback không đúng
 *       404:
 *         description: Không tìm thấy giao dịch
 */
router.get('/employer/payment-callback', validateEmployerPaymentCallback, AuthController.employerPaymentCallback);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Đăng nhập
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
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *           example:
 *             email: "user@example.com"
 *             password: "Password123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: string
 *                         role:
 *                           type: string
 *                         fullName:
 *                           type: string
 *       401:
 *         description: Email hoặc mật khẩu không chính xác
 *       403:
 *         description: Tài khoản bị khóa hoặc chưa xác thực
 */
router.post('/login', validateLogin, AuthController.login);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Quên mật khẩu - Yêu cầu OTP
 *     tags: [Authentication]
 *     description: Gửi mã OTP đến email để đặt lại mật khẩu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email đã đăng ký trong hệ thống
 *           example:
 *             email: "user@example.com"
 *     responses:
 *       200:
 *         description: Mã OTP đã được gửi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mã OTP đã được gửi đến email của bạn."
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Email không tồn tại trong hệ thống
 */
router.post('/forgot-password', validateForgotPassword, AuthController.forgotPassword);

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Xác thực OTP
 *     tags: [Authentication]
 *     description: Xác thực mã OTP để đặt lại mật khẩu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email đã đăng ký trong hệ thống
 *               otp:
 *                 type: string
 *                 pattern: '^\d{6}$'
 *                 description: Mã OTP 6 chữ số
 *           example:
 *             email: "user@example.com"
 *             otp: "123456"
 *     responses:
 *       200:
 *         description: Xác thực OTP thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xác thực OTP thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                     resetToken:
 *                       type: string
 *                       description: Token để đặt lại mật khẩu
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *       400:
 *         description: Mã OTP không hợp lệ, đã hết hạn hoặc đã được sử dụng
 *       404:
 *         description: Email không tồn tại trong hệ thống
 */
router.post('/verify-otp', validateVerifyOtp, AuthController.verifyOtp);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Đặt lại mật khẩu
 *     tags: [Authentication]
 *     description: Đặt lại mật khẩu và gửi mật khẩu mới qua email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email đã đăng ký trong hệ thống
 *               otp:
 *                 type: string
 *                 pattern: '^\d{6}$'
 *                 description: Mã OTP 6 chữ số
 *           example:
 *             email: "user@example.com"
 *             otp: "123456"
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mật khẩu mới đã được gửi vào email của bạn."
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *       400:
 *         description: Mã OTP không hợp lệ, đã hết hạn hoặc đã được sử dụng
 *       404:
 *         description: Email không tồn tại trong hệ thống
 */
router.post('/reset-password', validateVerifyOtp, AuthController.resetPassword);

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Làm mới Token
 *     tags: [Authentication]
 *     description: Cấp lại Access Token mới bằng Refresh Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token hợp lệ
 *           example:
 *             refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Cấp token mới thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *       401:
 *         description: Refresh Token không hợp lệ hoặc đã hết hạn
 */
router.post('/refresh-token', validateRefreshToken, AuthController.refreshToken);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Đăng xuất
 *     tags: [Authentication]
 *     description: Đăng xuất và vô hiệu hóa token hiện tại
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *           example:
 *             refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng xuất thành công."
 */
router.post('/logout', validateRefreshToken, AuthController.logout);

module.exports = router;
