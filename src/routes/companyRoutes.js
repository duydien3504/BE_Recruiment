const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/CompanyController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateUpdateCompany } = require('../validators/companyValidator');
const { uploadImage, handleUploadError } = require('../middleware/uploadMiddleware');

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Quản lý thông tin công ty
 */

/**
 * @swagger
 * /api/v1/companies/me:
 *   get:
 *     summary: Xem thông tin công ty của tôi
 *     tags: [Companies]
 *     description: Employer xem thông tin công ty của mình
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin công ty thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy thông tin công ty thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                     companyId:
 *                       type: string
 *                     name:
 *                       type: string
 *                     taxCode:
 *                       type: string
 *                     logoUrl:
 *                       type: string
 *                     websiteUrl:
 *                       type: string
 *                     addressDetail:
 *                       type: string
 *                     status:
 *                       type: string
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Không tìm thấy thông tin công ty (Chưa nâng cấp lên Employer)
 */
router.get('/me', authenticateToken, CompanyController.getMyCompany);

/**
 * @swagger
 * /api/v1/companies/me:
 *   put:
 *     summary: Cập nhật thông tin công ty
 *     tags: [Companies]
 *     description: Employer cập nhật thông tin công ty (Không được đổi Mã số thuế)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tech Corp Updated"
 *               phone_number:
 *                 type: string
 *                 example: "0987654321"
 *               description:
 *                 type: string
 *               scale:
 *                 type: string
 *                 example: "100-500"
 *               website_url:
 *                 type: string
 *               address_detail:
 *                 type: string
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
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc cố tình update Mã số thuế
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Không tìm thấy thông tin công ty
 */
router.put('/me', authenticateToken, validateUpdateCompany, CompanyController.updateMyCompany);

/**
 * @swagger
 * /api/v1/companies/logo:
 *   post:
 *     summary: Upload logo công ty
 *     tags: [Companies]
 *     description: Upload logo cho công ty (yêu cầu file ảnh)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh logo
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Upload logo thành công."
 *                 logo_url:
 *                   type: string
 *                   example: "https://res.cloudinary.com/..."
 *       400:
 *         description: File không hợp lệ hoặc thiếu file
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Không tìm thấy thông tin công ty
 */
router.post('/logo', authenticateToken, uploadImage.single('file'), handleUploadError, CompanyController.uploadLogo);

/**
 * @swagger
 * /api/v1/companies/background:
 *   post:
 *     summary: Upload ảnh bìa công ty
 *     tags: [Companies]
 *     description: Upload ảnh bìa (background/cover) cho công ty
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh bìa
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Upload ảnh bìa thành công."
 *                 background_url:
 *                   type: string
 *                   example: "https://res.cloudinary.com/..."
 *       400:
 *         description: File không hợp lệ hoặc thiếu file
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Không tìm thấy thông tin công ty
 */
router.post('/background', authenticateToken, uploadImage.single('file'), handleUploadError, CompanyController.uploadBackground);

/**
 * @swagger
 * /api/v1/companies:
 *   get:
 *     summary: Tìm kiếm danh sách công ty (Public)
 *     tags: [Companies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng item mỗi trang
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm theo tên công ty
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get('/', CompanyController.getCompanies);

/**
 * @swagger
 * /api/v1/companies/{id}/jobs:
 *   get:
 *     summary: Xem danh sách việc làm của công ty
 *     tags: [Companies]
 *     description: Lấy danh sách jobs đang active của công ty
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Không tìm thấy công ty
 */
router.get('/:id/jobs', CompanyController.getCompanyJobs);

/**
 * @swagger
 * /api/v1/companies/{id}:
 *   get:
 *     summary: Xem chi tiết công ty (Public)
 *     tags: [Companies]
 *     description: Xem thông tin chi tiết công ty theo ID (dành cho Guest/Candidate)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     companyId:
 *                       type: string
 *                     name:
 *                       type: string
 *                     jobPosts:
 *                       type: array
 *                       items:
 *                         type: object
 *       404:
 *         description: Không tìm thấy công ty
 */
router.get('/:id', CompanyController.getCompanyDetail);

module.exports = router;
