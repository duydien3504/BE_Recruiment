const UserService = require('../../src/services/UserService');
const { UserRepository, SkillRepository, CompanyRepository, TransactionRepository } = require('../../src/repositories');
const bcrypt = require('bcrypt');
const uploadService = require('../../src/utils/uploadService');
const momoHelper = require('../../src/utils/momoHelper');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');
const { sequelize } = require('../../src/config/database');
const { TRANSACTION_TYPES, TRANSACTION_STATUSES, PAYMENT_METHODS } = require('../../src/constant/transactionConstants');

jest.mock('bcrypt');
jest.mock('../../src/utils/uploadService');
jest.mock('../../src/utils/momoHelper');
jest.mock('../../src/config/database', () => ({
    sequelize: { transaction: jest.fn() }
}));

jest.mock('../../src/repositories', () => ({
    UserRepository: {
        findById: jest.fn(),
        findByIdWithRole: jest.fn(),
        update: jest.fn(),
        findWithSkills: jest.fn(),
        addSkills: jest.fn(),
        removeSkill: jest.fn()
    },
    SkillRepository: {
        findByIds: jest.fn()
    },
    CompanyRepository: {
        findByUserId: jest.fn(),
        findByTaxCode: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
        findById: jest.fn(),
        updateStatus: jest.fn()
    },
    TransactionRepository: {
        create: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        countFailedByCompanyAndType: jest.fn()
    }
}));

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ==================== getProfile ====================
    describe('getProfile', () => {
        const mockUser = {
            userId: 'uuid-123', email: 'test@example.com', fullName: 'Test User',
            phoneNumber: '0123456789', address: 'Ha Noi', dateOfBirth: '1990-01-01',
            gender: 'male', avatarUrl: 'https://example.com/avatar.jpg',
            bio: 'Software Developer with 5 years of experience',
            role: { roleName: 'CANDIDATE' }, status: 'Active',
            created_at: '2024-01-01T00:00:00.000Z', createdAt: '2024-01-01T00:00:00.000Z',
            password: 'hashed-password-should-not-be-returned'
        };

        test('should return user profile without password', async () => {
            UserRepository.findByIdWithRole.mockResolvedValue(mockUser);
            const result = await UserService.getProfile('uuid-123');
            expect(UserRepository.findByIdWithRole).toHaveBeenCalledWith('uuid-123');
            expect(result.password).toBeUndefined();
            expect(result.role).toBe('CANDIDATE');
            expect(result.status).toBe('Active');
        });

        test('should throw error when user not found', async () => {
            UserRepository.findByIdWithRole.mockResolvedValue(null);
            try { await UserService.getProfile('non-existent-id'); } catch (error) {
                expect(error.message).toBe(MESSAGES.USER_NOT_FOUND);
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }
        });

        test('should handle null role gracefully', async () => {
            UserRepository.findByIdWithRole.mockResolvedValue({ ...mockUser, role: null });
            const result = await UserService.getProfile('uuid-123');
            expect(result.role).toBeNull();
        });

        test('should return bio field', async () => {
            UserRepository.findByIdWithRole.mockResolvedValue(mockUser);
            const result = await UserService.getProfile('uuid-123');
            expect(result.bio).toBe('Software Developer with 5 years of experience');
        });
    });

    // ==================== updateProfile ====================
    describe('updateProfile', () => {
        const mockUser = {
            userId: 'uuid-123', email: 'test@example.com', fullName: 'Old Name',
            phoneNumber: '0123456789', address: 'Old Address', bio: 'Old Bio',
            dateOfBirth: '1990-01-01', gender: 'male', avatarUrl: 'https://example.com/old.jpg',
            role: 'seeker', isVerified: true, isActive: true,
            createdAt: '2024-01-01T00:00:00.000Z', password: 'hashed-password'
        };
        const mockUpdatedUser = { ...mockUser, fullName: 'New Name', phoneNumber: '0987654321', updatedAt: '2024-01-02T00:00:00.000Z' };

        test('should update user profile successfully', async () => {
            UserRepository.findById.mockResolvedValueOnce(mockUser);
            UserRepository.update.mockResolvedValue({});
            UserRepository.findById.mockResolvedValueOnce(mockUpdatedUser);
            const result = await UserService.updateProfile('uuid-123', { fullName: 'New Name', phone: '0987654321' });
            expect(UserRepository.update).toHaveBeenCalledWith('uuid-123', { fullName: 'New Name', phoneNumber: '0987654321' });
            expect(result.fullName).toBe('New Name');
            expect(result.password).toBeUndefined();
        });

        test('should throw error when user not found', async () => {
            UserRepository.findById.mockResolvedValue(null);
            try { await UserService.updateProfile('non-existent-id', {}); } catch (error) {
                expect(error.message).toBe(MESSAGES.USER_NOT_FOUND);
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }
        });

        test('should only update allowed fields', async () => {
            UserRepository.findById.mockResolvedValueOnce(mockUser);
            UserRepository.update.mockResolvedValue({});
            UserRepository.findById.mockResolvedValueOnce(mockUpdatedUser);
            await UserService.updateProfile('uuid-123', { fullName: 'New Name', email: 'hacker@example.com', password: 'newpass' });
            expect(UserRepository.update).toHaveBeenCalledWith('uuid-123', { fullName: 'New Name' });
        });
    });

    // ==================== changePassword ====================
    describe('changePassword', () => {
        const mockUser = { userId: 'uuid-123', email: 'test@example.com', password: 'hashed-old-password' };

        test('should change password successfully', async () => {
            bcrypt.compare.mockResolvedValue(true);
            bcrypt.hash.mockResolvedValue('hashed-new-password');
            UserRepository.findById.mockResolvedValue(mockUser);
            UserRepository.update.mockResolvedValue({});
            const result = await UserService.changePassword('uuid-123', { oldPassword: 'OldPassword123', newPassword: 'NewPassword456' });
            expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword456', 14);
            expect(result).toEqual({ success: true });
        });

        test('should throw error when user not found', async () => {
            UserRepository.findById.mockResolvedValue(null);
            try { await UserService.changePassword('non-existent-id', { oldPassword: 'a', newPassword: 'b' }); } catch (error) {
                expect(error.message).toBe(MESSAGES.USER_NOT_FOUND);
            }
        });

        test('should throw error when old password is incorrect', async () => {
            UserRepository.findById.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);
            try { await UserService.changePassword('uuid-123', { oldPassword: 'Wrong', newPassword: 'New' }); } catch (error) {
                expect(error.message).toBe(MESSAGES.OLD_PASSWORD_INCORRECT);
            }
            expect(bcrypt.hash).not.toHaveBeenCalled();
        });
    });

    // ==================== uploadAvatar ====================
    describe('uploadAvatar', () => {
        const mockUser = { userId: 'uuid-123' };
        const mockFileBuffer = Buffer.from('fake-image-data');
        const mockAvatarUrl = 'https://res.cloudinary.com/test/avatar.jpg';

        test('should upload avatar successfully', async () => {
            UserRepository.findById.mockResolvedValue(mockUser);
            uploadService.uploadToCloudinary.mockResolvedValue(mockAvatarUrl);
            UserRepository.update.mockResolvedValue({});
            const result = await UserService.uploadAvatar('uuid-123', mockFileBuffer);
            expect(result).toEqual({ avatarUrl: mockAvatarUrl });
        });

        test('should throw error when user not found', async () => {
            UserRepository.findById.mockResolvedValue(null);
            try { await UserService.uploadAvatar('non-existent-id', mockFileBuffer); } catch (error) {
                expect(error.message).toBe(MESSAGES.USER_NOT_FOUND);
            }
            expect(uploadService.uploadToCloudinary).not.toHaveBeenCalled();
        });
    });

    // ==================== getMySkills ====================
    describe('getMySkills', () => {
        test('should return list of skills successfully', async () => {
            const mockSkills = [{ skillId: 1, name: 'Java' }];
            UserRepository.findWithSkills.mockResolvedValue({ userId: 'uuid-123', skills: mockSkills });
            const result = await UserService.getMySkills('uuid-123');
            expect(result).toEqual(mockSkills);
        });

        test('should throw error when user not found', async () => {
            UserRepository.findWithSkills.mockResolvedValue(null);
            try { await UserService.getMySkills('non-existent-id'); } catch (error) {
                expect(error.message).toBe(MESSAGES.USER_NOT_FOUND);
            }
        });
    });

    // ==================== addSkills ====================
    describe('addSkills', () => {
        test('should add skills successfully', async () => {
            SkillRepository.findByIds.mockResolvedValue([{ skillId: 1 }, { skillId: 2 }]);
            UserRepository.addSkills.mockResolvedValue(true);
            const result = await UserService.addSkills('uuid-123', [1, 2]);
            expect(result).toEqual({ success: true });
        });

        test('should throw error when skills do not exist', async () => {
            SkillRepository.findByIds.mockResolvedValue([{ skillId: 1 }]);
            try { await UserService.addSkills('uuid-123', [1, 2, 3]); } catch (error) {
                expect(error.message).toBe(MESSAGES.SKILL_NOT_FOUND);
            }
            expect(UserRepository.addSkills).not.toHaveBeenCalled();
        });
    });

    // ==================== removeSkill ====================
    describe('removeSkill', () => {
        test('should remove skill successfully', async () => {
            UserRepository.removeSkill.mockResolvedValue(true);
            const result = await UserService.removeSkill('uuid-123', 1);
            expect(result).toEqual({ success: true });
        });

        test('should throw error when user not found', async () => {
            UserRepository.removeSkill.mockResolvedValue(false);
            try { await UserService.removeSkill('non-existent-id', 1); } catch (error) {
                expect(error.message).toBe(MESSAGES.USER_NOT_FOUND);
            }
        });
    });

    // ==================== upgradeToEmployer ====================
    describe('upgradeToEmployer', () => {
        const upgradeData = { company_name: 'Tech Corp', tax_code: '0123456789', address: '123 St', phone: '0987654321' };
        const mockUser = { userId: 'uuid-123' };
        const mockCompany = { companyId: 1, userId: 'uuid-123', status: 'Pending' };
        const mockTransaction = { transactionId: 100 };
        const mockPaymentUrl = 'https://test-payment.momo.vn/v2/gateway/pay?test=1';

        beforeEach(() => {
            UserRepository.findById.mockResolvedValue(mockUser);
            CompanyRepository.findByUserId.mockResolvedValue(null);
            CompanyRepository.findByTaxCode.mockResolvedValue(null);
            CompanyRepository.create.mockResolvedValue(mockCompany);
            TransactionRepository.create.mockResolvedValue(mockTransaction);
            momoHelper.createPaymentUrl.mockResolvedValue(mockPaymentUrl);
            sequelize.transaction.mockImplementation(async (cb) => cb({}));
        });

        test('should create company + transaction + return paymentUrl (happy path)', async () => {
            const result = await UserService.upgradeToEmployer('uuid-123', upgradeData, '127.0.0.1');

            expect(CompanyRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                userId: 'uuid-123', name: 'Tech Corp', taxCode: '0123456789', status: 'Pending'
            }), expect.any(Object));
            expect(TransactionRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                transactionType: TRANSACTION_TYPES.UPGRADE_EMPLOYER,
                status: TRANSACTION_STATUSES.PENDING,
                amount: 500000
            }), expect.any(Object));
            expect(momoHelper.createPaymentUrl).toHaveBeenCalled();
            expect(result.paymentUrl).toBe(mockPaymentUrl);
            expect(result.transactionId).toBe(100);
            expect(result.message).toBe(MESSAGES.UPGRADE_EMPLOYER_SUCCESS);
        });

        test('should throw error when user not found', async () => {
            UserRepository.findById.mockResolvedValue(null);
            try { await UserService.upgradeToEmployer('non-existent', upgradeData, '127.0.0.1'); } catch (error) {
                expect(error.message).toBe(MESSAGES.USER_NOT_FOUND);
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }
        });

        test('should throw error when company is already Active', async () => {
            CompanyRepository.findByUserId.mockResolvedValue({ ...mockCompany, status: 'Active' });
            try { await UserService.upgradeToEmployer('uuid-123', upgradeData, '127.0.0.1'); } catch (error) {
                expect(error.message).toBe(MESSAGES.ALREADY_EMPLOYER);
                expect(error.status).toBe(HTTP_STATUS.BAD_REQUEST);
            }
        });

        test('should throw error when tax code exists (new company)', async () => {
            CompanyRepository.findByTaxCode.mockResolvedValue({ companyId: 99 });
            try { await UserService.upgradeToEmployer('uuid-123', upgradeData, '127.0.0.1'); } catch (error) {
                expect(error.message).toBe(MESSAGES.TAX_CODE_EXISTS);
            }
        });

        test('should retry with existing Pending company when failedCount < 3', async () => {
            CompanyRepository.findByUserId.mockResolvedValue(mockCompany);
            TransactionRepository.countFailedByCompanyAndType.mockResolvedValue(1);
            CompanyRepository.findByTaxCode.mockResolvedValue(null);

            const result = await UserService.upgradeToEmployer('uuid-123', upgradeData, '127.0.0.1');

            expect(CompanyRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({
                name: 'Tech Corp', taxCode: '0123456789'
            }));
            expect(TransactionRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                companyId: 1, transactionType: TRANSACTION_TYPES.UPGRADE_EMPLOYER
            }));
            expect(result.message).toBe(MESSAGES.UPGRADE_PAYMENT_RETRY);
            expect(result.paymentUrl).toBe(mockPaymentUrl);
        });

        test('should soft delete and create new company when failedCount >= 3', async () => {
            CompanyRepository.findByUserId.mockResolvedValue(mockCompany);
            TransactionRepository.countFailedByCompanyAndType.mockResolvedValue(3);
            CompanyRepository.softDelete.mockResolvedValue(true);

            const result = await UserService.upgradeToEmployer('uuid-123', upgradeData, '127.0.0.1');

            expect(CompanyRepository.softDelete).toHaveBeenCalledWith(1);
            expect(CompanyRepository.create).toHaveBeenCalled();
            expect(result.message).toBe(MESSAGES.UPGRADE_EMPLOYER_SUCCESS);
        });

        test('should throw tax code exists on retry when another company owns it', async () => {
            CompanyRepository.findByUserId.mockResolvedValue(mockCompany);
            TransactionRepository.countFailedByCompanyAndType.mockResolvedValue(1);
            CompanyRepository.findByTaxCode.mockResolvedValue({ companyId: 99 }); // different company

            try { await UserService.upgradeToEmployer('uuid-123', upgradeData, '127.0.0.1'); } catch (error) {
                expect(error.message).toBe(MESSAGES.TAX_CODE_EXISTS);
            }
        });

        test('should allow same tax code on retry for own company', async () => {
            CompanyRepository.findByUserId.mockResolvedValue(mockCompany);
            TransactionRepository.countFailedByCompanyAndType.mockResolvedValue(1);
            CompanyRepository.findByTaxCode.mockResolvedValue(mockCompany); // same company

            const result = await UserService.upgradeToEmployer('uuid-123', upgradeData, '127.0.0.1');
            expect(result.paymentUrl).toBe(mockPaymentUrl);
        });
    });
});
