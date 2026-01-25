const { UserRepository, SkillRepository, CompanyRepository } = require('../repositories');
const bcrypt = require('bcrypt');
const uploadService = require('../utils/uploadService');
const MESSAGES = require('../constant/messages');
const HTTP_STATUS = require('../constant/statusCode');

class UserService {
    /**
     * Lấy thông tin profile của user
     * Complexity: O(1) - Primary key lookup
     * @param {string} userId - User ID từ token
     * @returns {Object} User profile (không bao gồm password)
     */
    async getProfile(userId) {
        const user = await UserRepository.findById(userId);

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
            role: user.role,
            isVerified: user.isVerified,
            isActive: user.isActive,
            createdAt: user.createdAt
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
     * Đăng ký nâng cấp lên Employer
     * @param {string} userId - User ID
     * @param {Object} data - Company Info
     * @returns {Object} Success message
     */
    async upgradeToEmployer(userId, data) {
        const user = await UserRepository.findById(userId);
        if (!user) {
            const error = new Error(MESSAGES.USER_NOT_FOUND);
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        // Check existing company for user
        const existingCompany = await CompanyRepository.findByUserId(userId);
        if (existingCompany) {
            const error = new Error(MESSAGES.ALREADY_EMPLOYER);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        // Check tax code
        const taxCodeExists = await CompanyRepository.findByTaxCode(data.tax_code);
        if (taxCodeExists) {
            const error = new Error(MESSAGES.TAX_CODE_EXISTS);
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        // Create Company
        // Map request fields to model fields
        const companyData = {
            userId,
            name: data.company_name,
            taxCode: data.tax_code,
            addressDetail: data.address,
            phoneNumber: data.phone,
            status: 'Pending'
        };

        await CompanyRepository.create(companyData);

        return {
            message: MESSAGES.UPGRADE_EMPLOYER_SUCCESS
        };
    }
}

module.exports = new UserService();
