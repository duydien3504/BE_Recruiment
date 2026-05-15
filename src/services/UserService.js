const { UserRepository, SkillRepository, CompanyRepository, TransactionRepository } = require('../repositories');
const bcrypt = require('bcrypt');
const uploadService = require('../utils/uploadService');
const momoHelper = require('../utils/momoHelper');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');
const { ROLES } = require('../constant/roles');
const { sequelize } = require('../config/database');
const {
    TRANSACTION_TYPES,
    TRANSACTION_STATUSES,
    PAYMENT_METHODS,
    MOMO_RESULT_CODES
} = require('../constant/transactionConstants');

const MAX_UPGRADE_PAYMENT_RETRIES = 3;
const UPGRADE_EMPLOYER_AMOUNT = 500000;

class UserService {

    /**
     * Lấy thông tin profile của user
     * Complexity: O(1) - Primary key lookup
     * @param {string} userId - User ID từ token
     * @returns {Object} User profile (không bao gồm password)
     */
    async getProfile(userId) {
        const user = await UserRepository.findByIdWithRole(userId);

        if (!user) {
            const error = new Error(MESSAGES.USER_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Return DTO - exclude sensitive data
        return {
            userId: user.userId,
            email: user.email,
            fullName: user.fullName,
            phone: user.phoneNumber,
            address: user.address,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            avatar: user.avatarUrl,
            bio: user.bio,
            role: user.role ? user.role.roleName : null,
            status: user.status,
            createdAt: user.created_at || user.createdAt
        };
    }

    /**
     * Cập nhật thông tin profile của user
     * Complexity: O(1) - Primary key update
     * @param {string} userId - User ID từ token
     * @param {Object} updateData - Dữ liệu cập nhật
     * @returns {Object} Updated user profile
     */
    async updateProfile(userId, updateData) {
        const user = await UserRepository.findById(userId);

        if (!user) {
            const error = new Error(MESSAGES.USER_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Chỉ update các field được phép
        const allowedFields = ['fullName', 'phone', 'address', 'bio', 'dateOfBirth', 'gender', 'avatar'];
        const dataToUpdate = {};

        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                // Map field names from request to model
                const modelField = field === 'phone' ? 'phoneNumber' :
                    field === 'avatar' ? 'avatarUrl' : field;
                dataToUpdate[modelField] = updateData[field];
            }
        });

        await UserRepository.update(userId, dataToUpdate);

        // Lấy lại user sau khi update
        const updatedUser = await UserRepository.findById(userId);

        // Return DTO
        return {
            userId: updatedUser.userId,
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            phone: updatedUser.phoneNumber,
            address: updatedUser.address,
            dateOfBirth: updatedUser.dateOfBirth,
            gender: updatedUser.gender,
            avatar: updatedUser.avatarUrl,
            bio: updatedUser.bio,
            role: updatedUser.role,
            isVerified: updatedUser.isVerified,
            isActive: updatedUser.isActive,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        };
    }

    /**
     * Đổi mật khẩu
     * Complexity: O(1) - Primary key operations
     * @param {string} userId - User ID từ token
     * @param {Object} data - { oldPassword, newPassword }
     * @returns {Object} Success indicator
     */
    async changePassword(userId, data) {
        const { oldPassword, newPassword } = data;

        // Lấy user với password
        const user = await UserRepository.findById(userId);

        if (!user) {
            const error = new Error(MESSAGES.USER_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Verify old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordValid) {
            const error = new Error(MESSAGES.OLD_PASSWORD_INCORRECT);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        // Hash new password with cost 14 (theo RULE.md)
        const hashedPassword = await bcrypt.hash(newPassword, 14);

        // Update password
        await UserRepository.update(userId, { password: hashedPassword });

        return {
            success: true
        };
    }

    /**
     * Upload avatar
     * Complexity: O(1) - Primary key operations
     * @param {string} userId - User ID từ token
     * @param {Buffer} fileBuffer - File buffer from multer
     * @returns {Object} Avatar URL
     */
    async uploadAvatar(userId, fileBuffer) {
        // Check user exists
        const user = await UserRepository.findById(userId);

        if (!user) {
            const error = new Error(MESSAGES.USER_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Upload to Cloudinary
        const avatarUrl = await uploadService.uploadToCloudinary(fileBuffer, 'avatars');

        // Update user avatar
        await UserRepository.update(userId, { avatarUrl: avatarUrl });

        return {
            avatarUrl
        };
    }

    /**
     * Lấy danh sách kỹ năng của user
     * Complexity: O(1) - Eager loading via JOIN
     * @param {string} userId - User ID từ token
     * @returns {Array} List of skills
     */
    async getMySkills(userId) {
        const user = await UserRepository.findWithSkills(userId);

        if (!user) {
            const error = new Error(MESSAGES.USER_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        return user.skills || [];
    }

    /**
     * Thêm kỹ năng cho user
     * @param {string} userId - User ID
     * @param {Array<number>} skillIds - List of skill IDs
     * @returns {Object} Success object
     */
    async addSkills(userId, skillIds) {
        // Validate skills exist
        const foundSkills = await SkillRepository.findByIds(skillIds);

        // Ensure all skills exist (found count must match requested count)
        // Note: Set used to handle potential duplicates in count if not handled by unique validation
        if (foundSkills.length !== new Set(skillIds).size) {
            const error = new Error(MESSAGES.SKILL_NOT_FOUND);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        const result = await UserRepository.addSkills(userId, skillIds);

        if (!result) {
            const error = new Error(MESSAGES.USER_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        return {
            success: true
        };
    }

    /**
     * Xóa kỹ năng của user
     * @param {string} userId - User ID
     * @param {number} skillId - Skill ID needed to remove
     * @returns {Object} Success object
     */
    async removeSkill(userId, skillId) {
        const result = await UserRepository.removeSkill(userId, skillId);

        if (!result) {
            const error = new Error(MESSAGES.USER_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        return {
            success: true
        };
    }

    /**
     * Đăng ký nâng cấp lên Employer với tích hợp MoMo
     * Hỗ trợ retry tối đa 3 lần thanh toán thất bại
     * @param {string} userId - User ID
     * @param {Object} data - Company Info (company_name, tax_code, address, phone)
     * @param {string} ipAddr - IP address for MoMo
     * @returns {Object} { message, paymentUrl, transactionId }
     */
    async upgradeToEmployer(userId, data, ipAddr) {
        const user = await UserRepository.findById(userId);
        if (!user) {
            const error = new Error(MESSAGES.USER_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Check existing company for user
        let existingCompany = await CompanyRepository.findByUserId(userId);

        // Case A: Company exists and already Active
        if (existingCompany && existingCompany.status === 'Active') {
            const error = new Error(MESSAGES.ALREADY_EMPLOYER);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        // Case B: Company exists and Pending (retry scenario)
        if (existingCompany && existingCompany.status === 'Pending') {
            const failedCount = await TransactionRepository.countFailedByCompanyAndType(
                existingCompany.companyId,
                TRANSACTION_TYPES.UPGRADE_EMPLOYER
            );

            if (failedCount >= MAX_UPGRADE_PAYMENT_RETRIES) {
                // Exhausted retries → soft delete company, then fall through to Case C
                await CompanyRepository.softDelete(existingCompany.companyId);
                existingCompany = null;
            } else {
                // Still have retries → update company info + create new transaction
                // Validate tax code (exclude current company)
                const taxCodeOwner = await CompanyRepository.findByTaxCode(data.tax_code);
                if (taxCodeOwner && taxCodeOwner.companyId !== existingCompany.companyId) {
                    const error = new Error(MESSAGES.TAX_CODE_EXISTS);
                    error.status = HTTP_STATUS.BAD_REQUEST;
                    throw error;
                }

                // Update company info with new data from body
                await CompanyRepository.update(existingCompany.companyId, {
                    name: data.company_name,
                    taxCode: data.tax_code,
                    addressDetail: data.address,
                    phoneNumber: data.phone
                });

                // Create new transaction for existing company
                const transaction = await TransactionRepository.create({
                    companyId: existingCompany.companyId,
                    jobPostId: null,
                    amount: UPGRADE_EMPLOYER_AMOUNT,
                    paymentMethod: PAYMENT_METHODS.MOMO,
                    transactionType: TRANSACTION_TYPES.UPGRADE_EMPLOYER,
                    status: TRANSACTION_STATUSES.PENDING
                });

                const paymentUrl = await momoHelper.createPaymentUrl({
                    amount: UPGRADE_EMPLOYER_AMOUNT,
                    orderInfo: `NangCapEmployer${transaction.transactionId}`,
                    orderId: transaction.transactionId.toString()
                });

                return {
                    message: MESSAGES.UPGRADE_PAYMENT_RETRY,
                    paymentUrl,
                    transactionId: transaction.transactionId
                };
            }
        }

        // Case C: No company (or just soft-deleted) → create new
        // Validate tax code
        const taxCodeExists = await CompanyRepository.findByTaxCode(data.tax_code);
        if (taxCodeExists) {
            const error = new Error(MESSAGES.TAX_CODE_EXISTS);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        const result = await sequelize.transaction(async (databaseTransaction) => {
            // Create Company
            const company = await CompanyRepository.create({
                userId,
                name: data.company_name,
                taxCode: data.tax_code,
                addressDetail: data.address,
                phoneNumber: data.phone,
                status: 'Pending'
            }, { transaction: databaseTransaction });

            // Create Transaction
            const transaction = await TransactionRepository.create({
                companyId: company.companyId,
                jobPostId: null,
                amount: UPGRADE_EMPLOYER_AMOUNT,
                paymentMethod: PAYMENT_METHODS.MOMO,
                transactionType: TRANSACTION_TYPES.UPGRADE_EMPLOYER,
                status: TRANSACTION_STATUSES.PENDING
            }, { transaction: databaseTransaction });

            // Create MoMo payment URL
            const paymentUrl = await momoHelper.createPaymentUrl({
                amount: UPGRADE_EMPLOYER_AMOUNT,
                orderInfo: `NangCapEmployer${transaction.transactionId}`,
                orderId: transaction.transactionId.toString()
            });

            return {
                message: MESSAGES.UPGRADE_EMPLOYER_SUCCESS,
                paymentUrl,
                transactionId: transaction.transactionId
            };
        });

        return result;
    }


    // --- Admin Methods ---

    async getAllUsers(query) {
        const { role, status, page = 1, limit = 10 } = query;
        const keyword = query.keyword ? query.keyword.trim() : null;

        const options = {
            attributes: ['userId', 'email', 'fullName', 'phoneNumber', 'status', 'avatarUrl', ['created_at', 'createdAt']],
            offset: (page - 1) * limit,
            limit: parseInt(limit),
            order: [['created_at', 'DESC']]
        };

        const result = await UserRepository.findAllUsers({ keyword, role, status }, options);
        return result;
    }

    async getUserDetailForAdmin(id) {
        const user = await UserRepository.findById(id);
        if (!user) {
            const error = new Error(MESSAGES.USER_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }
        // Return full detail possibly excluding sensitive like password
        return {
            userId: user.userId,
            email: user.email,
            fullName: user.fullName,
            phone: user.phoneNumber, // map back
            address: user.address,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            avatarUrl: user.avatarUrl,
            role: user.role,
            status: user.status,
            isVerified: user.isVerified,
            createdAt: user.createdAt
        };
    }

    async updateUserStatus(id, status) {
        const user = await UserRepository.findById(id);
        if (!user) {
            const error = new Error(MESSAGES.USER_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        if (!['Active', 'Banned'].includes(status)) {
            const error = new Error('Trạng thái không hợp lệ.');
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        return await UserRepository.updateStatus(id, status);
    }
}

module.exports = new UserService();
