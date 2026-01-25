const CompanyService = require('../services/CompanyService');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

class CompanyController {
    /**
     * Xem thông tin công ty của tôi
     * @route GET /api/v1/companies/me
     */
    async getMyCompany(req, res, next) {
        try {
            const userId = req.user.userId;
            const company = await CompanyService.getMyCompany(userId);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_COMPANY_SUCCESS,
                data: company
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Cập nhật thông tin công ty của tôi
     * @route PUT /api/v1/companies/me
     */
    async updateMyCompany(req, res, next) {
        try {
            const userId = req.user.userId;
            await CompanyService.updateMyCompany(userId, req.body);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.UPDATE_COMPANY_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Upload logo công ty
     * @route POST /api/v1/companies/logo
     */
    async uploadLogo(req, res, next) {
        try {
            const userId = req.user.userId;
            const file = req.file;

            if (!file) {
                const error = new Error('Vui lòng chọn file ảnh.');
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }

            const logoUrl = await CompanyService.uploadLogo(userId, file.buffer);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.UPLOAD_LOGO_SUCCESS,
                logo_url: logoUrl
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Upload ảnh bìa công ty
     * @route POST /api/v1/companies/background
     */
    async uploadBackground(req, res, next) {
        try {
            const userId = req.user.userId;
            const file = req.file;

            if (!file) {
                const error = new Error('Vui lòng chọn file ảnh.');
                error.status = HTTP_STATUS.BAD_REQUEST;
                throw error;
            }

            const backgroundUrl = await CompanyService.uploadBackground(userId, file.buffer);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.UPLOAD_BACKGROUND_SUCCESS,
                background_url: backgroundUrl
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Xem chi tiết công ty (Public)
     * @route GET /api/v1/companies/:id
     */
    async getCompanyDetail(req, res, next) {
        try {
            const { id } = req.params;
            const company = await CompanyService.getCompanyDetail(id);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_COMPANY_SUCCESS,
                data: company
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Tìm kiếm danh sách công ty (Public)
     * @route GET /api/v1/companies
     */
    async getCompanies(req, res, next) {
        try {
            const result = await CompanyService.getCompanies(req.query);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_COMPANIES_SUCCESS,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Xem danh sách việc làm của công ty
     * @route GET /api/v1/companies/:id/jobs
     */
    async getCompanyJobs(req, res, next) {
        try {
            const { id } = req.params;
            const jobs = await CompanyService.getCompanyJobs(id);

            return res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.GET_COMPANY_JOBS_SUCCESS,
                data: jobs
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CompanyController();
