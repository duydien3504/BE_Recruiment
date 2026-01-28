const express = require('express');
const router = express.Router();
const SkillController = require('../controllers/SkillController');

/**
 * @swagger
 * tags:
 *   name: Skills
 *   description: Quản lý kỹ năng
 */

/**
 * @swagger
 * /api/v1/skills:
 *   get:
 *     summary: Lấy danh sách kỹ năng (Public)
 *     tags: [Skills]
 *     description: Lấy danh sách tất cả các kỹ năng.
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
 *                   example: "Lấy danh sách kỹ năng thành công."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       skillId:
 *                         type: integer
 *                       name:
 *                         type: string
 */
router.get('/', SkillController.getAllSkills);

module.exports = router;
