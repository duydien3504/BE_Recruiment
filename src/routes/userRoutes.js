const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateUpdateProfile, validateChangePassword, validateAddSkills, validateDeleteSkill, validateUpgradeEmployer } = require('../validators/userValidator');
const { uploadImage, handleUploadError } = require('../middleware/uploadMiddleware');

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Xem hồ sơ cá nhân
 *     tags: [Users]
 *     description: Lấy thông tin chi tiết của user đang đăng nhập
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy thông tin thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "uuid-123"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     fullName:
 *                       type: string
 *                       example: "Nguyen Van A"
 *                     phone:
 *                       type: string
 *                       example: "0123456789"
 *                     address:
 *                       type: string
 *                       example: "Ha Noi"
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                       example: "1990-01-01"
 *                     gender:
 *                       type: string
 *                       example: "male"
 *                     avatar:
 *                       type: string
 *                       example: "https://example.com/avatar.jpg"
 *                     bio:
 *                       type: string
 *                       example: "Software Developer with 5 years of experience"
 *                       description: "User biography/description"
 *                     role:
 *                       type: string
 *                       example: "CANDIDATE"
 *                       description: "Role name (ADMIN, EMPLOYER, CANDIDATE)"
 *                     status:
 *                       type: string
 *                       enum: [Active, Inactive, Banned]
 *                       example: "Active"
 *                       description: "Account status"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T00:00:00.000Z"
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 */
router.get('/profile', authenticateToken, UserController.getProfile);

/**
 * @swagger
 * /api/v1/users/profile:
 *   put:
 *     summary: Cập nhật hồ sơ cá nhân
 *     tags: [Users]
 *     description: Cập nhật thông tin cá nhân của user đang đăng nhập
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Nguyen Van A"
 *               phone:
 *                 type: string
 *                 pattern: '^(0|\+84)(3|5|7|8|9)[0-9]{8}$'
 *                 example: "0123456789"
 *               address:
 *                 type: string
 *                 example: "Ha Noi"
 *               bio:
 *                 type: string
 *                 example: "Software Developer"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "male"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     address:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     dateOfBirth:
 *                       type: string
 *                     gender:
 *                       type: string
 *                     avatar:
 *                       type: string
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 */
router.put('/profile', authenticateToken, validateUpdateProfile, UserController.updateProfile);

/**
 * @swagger
 * /api/v1/users/change-password:
 *   patch:
 *     summary: Đổi mật khẩu
 *     tags: [Users]
 *     description: Đổi mật khẩu khi đang đăng nhập
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Mật khẩu hiện tại
 *                 example: "OldPassword123"
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 pattern: '^(?=.*[A-Z])(?=.*\d)'
 *                 description: Mật khẩu mới (tối thiểu 8 ký tự, có chữ hoa và số)
 *                 example: "NewPassword123"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đổi mật khẩu thành công."
 *       400:
 *         description: Mật khẩu cũ không chính xác hoặc mật khẩu mới không hợp lệ
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 */
router.patch('/change-password', authenticateToken, validateChangePassword, UserController.changePassword);

/**
 * @swagger
 * /api/v1/users/avatar:
 *   post:
 *     summary: Upload avatar
 *     tags: [Users]
 *     description: Upload ảnh đại diện của user đang đăng nhập
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh (JPG, JPEG, PNG, tối đa 5MB)
 *     responses:
 *       200:
 *         description: Upload avatar thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Upload avatar thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                     avatarUrl:
 *                       type: string
 *                       example: "https://res.cloudinary.com/..."
 *       400:
 *         description: File không hợp lệ (sai định dạng hoặc quá lớn)
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 */
router.post('/avatar', authenticateToken, uploadImage.single('file'), handleUploadError, UserController.uploadAvatar);

/**
 * @swagger
 * /api/v1/users/skills:
 *   get:
 *     summary: Lấy danh sách kỹ năng của tôi
 *     tags: [Users]
 *     description: Xem danh sách kỹ năng user đã chọn
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách kỹ năng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách kỹ năng thành công."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       skillId:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Java"
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 */
router.get('/skills', authenticateToken, UserController.getMySkills);

/**
 * @swagger
 * /api/v1/users/skills:
 *   post:
 *     summary: Thêm kỹ năng
 *     tags: [Users]
 *     description: Thêm kỹ năng vào hồ sơ user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skillIds
 *             properties:
 *               skillIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: List of Skill IDs to add
 *                 example: [1, 2, 3]
 *     responses:
 *       201:
 *         description: Thêm kỹ năng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thêm kỹ năng thành công."
 *       400:
 *         description: Danh sách kỹ năng không hợp lệ hoặc không tồn tại
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 */
router.post('/skills', authenticateToken, validateAddSkills, UserController.addSkills);

/**
 * @swagger
 * /api/v1/users/skills/{skillId}:
 *   delete:
 *     summary: Xóa kỹ năng
 *     tags: [Users]
 *     description: Xóa kỹ năng khỏi hồ sơ
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của kỹ năng cần xóa
 *     responses:
 *       200:
 *         description: Đã xóa kỹ năng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đã xóa kỹ năng."
 *       400:
 *         description: ID kỹ năng không hợp lệ
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 */
router.delete('/skills/:skillId', authenticateToken, validateDeleteSkill, UserController.removeSkill);

/**
 * @swagger
 * /api/v1/users/upgrade-employer:
 *   post:
 *     summary: Đăng ký nâng cấp lên Employer
 *     tags: [Users]
 *     description: User Candidate đăng ký thông tin công ty để nâng cấp thành Employer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tax_code
 *               - company_name
 *             properties:
 *               tax_code:
 *                 type: string
 *                 example: "0123456789"
 *               company_name:
 *                 type: string
 *                 example: "ABC Tech Corp"
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *               phone:
 *                 type: string
 *                 example: "0987654321"
 *     responses:
 *       200:
 *         description: Đăng ký nâng cấp thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng ký nâng cấp thành công."
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc đã tồn tại (Tax code, đã đăng ký)
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 */
router.post('/upgrade-employer', authenticateToken, validateUpgradeEmployer, UserController.upgradeToEmployer);

module.exports = router;
