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

    /**
     * Get growth stats (7 days)
     * @route GET /api/v1/admin/stats/growth
     */
    async getGrowthStats(req, res, next) {
        try {
            const stats = await StatisticsService.getGrowthStats();
            return res.status(HTTP_STATUS.OK).json({
                message: 'Lấy thống kê tăng trưởng thành công.',
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }
    /**
     * Xác thực công ty
     * @route PATCH /api/v1/admin/companies/:id/verify
     */
    async verifyCompany(req, res, next) {
        try {
            const { id } = req.params;
            
            const CompanyService = require('../services/CompanyService');
            const result = await CompanyService.verifyCompany(id);

            return res.status(HTTP_STATUS.OK).json({
                message: result.message,
                verified: result.verified
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AdminController();
