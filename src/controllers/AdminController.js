const StatisticsService = require('../services/StatisticsService');
const HTTP_STATUS = require('../constant/statusCode');

class AdminController {
    /**
     * Get dashboard stats
     * @route GET /api/v1/admin/stats/dashboard
     */
    async getDashboardStats(req, res, next) {
        try {
            const stats = await StatisticsService.getDashboardStats();
            return res.status(HTTP_STATUS.OK).json({
                message: 'Lấy thống kê thành công.',
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AdminController();
