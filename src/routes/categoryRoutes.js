const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Quản lý danh mục ngành nghề
 */

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Lấy danh sách ngành nghề (Public)
 *     tags: [Categories]
 *     description: Lấy danh sách tất cả các ngành nghề khả dụng.
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
 *                   example: "Lấy danh sách ngành nghề thành công."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       categoryId:
 *                         type: integer
 *                       name:
 *                         type: string
 */
router.get('/', CategoryController.getAllCategories);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Chi tiết ngành nghề (Public)
 *     tags: [Categories]
 *     description: Lấy thông tin chi tiết của một ngành nghề.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
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
 *                   example: "Lấy chi tiết ngành nghề thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                     categoryId:
 *                       type: integer
 *                     name:
 *                       type: string
 *       404:
 *         description: Không tìm thấy ngành nghề
 */
router.get('/:id', CategoryController.getCategoryDetail);

module.exports = router;
