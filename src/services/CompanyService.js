const { CompanyRepository, JobPostRepository } = require('../repositories');
const uploadService = require('../utils/uploadService');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

class CompanyService {
    /**
     * Lấy thông tin công ty của user
     * @param {string} userId - User ID
     * @returns {Object} Company info
     */
    async getMyCompany(userId) {
        const company = await CompanyRepository.findByUserId(userId);

        if (!company) {
            const error = new Error(MESSAGES.COMPANY_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        return company;
    }

    /**
     * Cập nhật thông tin công ty
     * @param {string} userId - User ID
     * @param {Object} updateData - Data to update
     * @returns {Object} Updated Company info
     */
    async updateMyCompany(userId, updateData) {
        const company = await CompanyRepository.findByUserId(userId);

        if (!company) {
            const error = new Error(MESSAGES.COMPANY_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Map snake_case from request to camelCase for model
        const dataToUpdate = {};
        if (updateData.name) dataToUpdate.name = updateData.name;
        if (updateData.phone_number) dataToUpdate.phoneNumber = updateData.phone_number;
        if (updateData.description !== undefined) dataToUpdate.description = updateData.description;
        if (updateData.scale !== undefined) dataToUpdate.scale = updateData.scale;
        if (updateData.website_url !== undefined) dataToUpdate.websiteUrl = updateData.website_url;
        if (updateData.address_detail !== undefined) dataToUpdate.addressDetail = updateData.address_detail;
        if (updateData.logo_url !== undefined) dataToUpdate.logoUrl = updateData.logo_url;
        if (updateData.background_url !== undefined) dataToUpdate.backgroundUrl = updateData.background_url;

        await CompanyRepository.update(company.companyId, dataToUpdate);

        return await CompanyRepository.findById(company.companyId);
    }

    /**
     * Upload logo công ty
     * @param {string} userId - User ID
     * @param {Buffer} fileBuffer - Image file buffer
     * @returns {string} Logo URL
     */
    async uploadLogo(userId, fileBuffer) {
        const company = await CompanyRepository.findByUserId(userId);

        if (!company) {
            const error = new Error(MESSAGES.COMPANY_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        const logoUrl = await uploadService.uploadToCloudinary(fileBuffer, 'company-logos');

        await CompanyRepository.update(company.companyId, { logoUrl: logoUrl });

        return logoUrl;
    }

    /**
     * Upload ảnh bìa công ty
     * @param {string} userId - User ID
     * @param {Buffer} fileBuffer - Image file buffer
     * @returns {string} Background URL
     */
    async uploadBackground(userId, fileBuffer) {
        const company = await CompanyRepository.findByUserId(userId);

        if (!company) {
            const error = new Error(MESSAGES.COMPANY_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        const backgroundUrl = await uploadService.uploadToCloudinary(fileBuffer, 'company-backgrounds');

        await CompanyRepository.update(company.companyId, { backgroundUrl: backgroundUrl });

        return backgroundUrl;
    }

    /**
     * Lấy chi tiết công ty (Public)
     * @param {string} companyId - Company ID
     * @returns {Object} Company detail
     */
    async getCompanyDetail(companyId) {
        const company = await CompanyRepository.getDetail(companyId);

        if (!company) {
            const error = new Error(MESSAGES.COMPANY_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        return company;
    }

    /**
     * Tìm kiếm danh sách công ty (Public)
     * @param {Object} params - { page, limit, keyword }
     * @returns {Object} List of companies with pagination
     */
    async getCompanies(params) {
        const { page = 1, limit = 10, keyword = '' } = params;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;

        const { count, rows } = await CompanyRepository.getCompanies({
            page: pageNum,
            limit: limitNum,
            keyword
        });

        return {
            data: rows,
            pagination: {
                total: count,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(count / limitNum)
            }
        };
    }

    /**
     * Lấy danh sách việc làm của công ty (Public)
     * @param {string} companyId - Company ID
     * @returns {Array} List of jobs
     */
    async getCompanyJobs(companyId) {
        const company = await CompanyRepository.findById(companyId);
        if (!company) {
            const error = new Error(MESSAGES.COMPANY_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        const jobs = await JobPostRepository.findActiveJobsByCompany(companyId, {
            order: [['created_at', 'DESC']]
        });

        return jobs;
    }
}

module.exports = new CompanyService();
