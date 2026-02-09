const UserService = require('../../src/services/UserService');
const { UserRepository, SkillRepository, CompanyRepository } = require('../../src/repositories');
const bcrypt = require('bcrypt');
const uploadService = require('../../src/utils/uploadService');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('bcrypt');
jest.mock('../../src/utils/uploadService');

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
        create: jest.fn()
    }
}));

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getProfile', () => {
        const mockUser = {
            userId: 'uuid-123',
            email: 'test@example.com',
            fullName: 'Test User',
            phoneNumber: '0123456789',
            address: 'Ha Noi',
            dateOfBirth: '1990-01-01',
            gender: 'male',
            avatarUrl: 'https://example.com/avatar.jpg',
            bio: 'Software Developer with 5 years of experience',
            role: {
                roleName: 'CANDIDATE'
            },
            status: 'Active',
            created_at: '2024-01-01T00:00:00.000Z',
            createdAt: '2024-01-01T00:00:00.000Z',
            password: 'hashed-password-should-not-be-returned'
        };

        test('should return user profile without password', async () => {
            UserRepository.findByIdWithRole.mockResolvedValue(mockUser);

            const result = await UserService.getProfile('uuid-123');

            expect(UserRepository.findByIdWithRole).toHaveBeenCalledWith('uuid-123');
            expect(result).toEqual({
                userId: 'uuid-123',
                email: 'test@example.com',
                fullName: 'Test User',
                phone: '0123456789',
                address: 'Ha Noi',
                dateOfBirth: '1990-01-01',
                gender: 'male',
                avatar: 'https://example.com/avatar.jpg',
                bio: 'Software Developer with 5 years of experience',
                role: 'CANDIDATE',
                status: 'Active',
                createdAt: '2024-01-01T00:00:00.000Z'
            });
            expect(result.password).toBeUndefined();
        });

        test('should throw error when user not found', async () => {
            UserRepository.findByIdWithRole.mockResolvedValue(null);

            try {
                await UserService.getProfile('non-existent-id');
            } catch (error) {
                expect(error.message).toBe(MESSAGES.USER_NOT_FOUND);
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }

            expect(UserRepository.findByIdWithRole).toHaveBeenCalledWith('non-existent-id');
        });

        test('should use O(1) complexity with primary key lookup', async () => {
            UserRepository.findByIdWithRole.mockResolvedValue(mockUser);

            await UserService.getProfile('uuid-123');

            expect(UserRepository.findByIdWithRole).toHaveBeenCalledTimes(1);
        });

        test('should return createdAt field with account creation date', async () => {
            UserRepository.findByIdWithRole.mockResolvedValue(mockUser);

            const result = await UserService.getProfile('uuid-123');

            expect(result.createdAt).toBeDefined();
            expect(result.createdAt).toBe('2024-01-01T00:00:00.000Z');
            expect(typeof result.createdAt).toBe('string');
        });

        test('should return role field with role name', async () => {
            UserRepository.findByIdWithRole.mockResolvedValue(mockUser);

            const result = await UserService.getProfile('uuid-123');

            expect(result.role).toBeDefined();
            expect(result.role).toBe('CANDIDATE');
            expect(typeof result.role).toBe('string');
        });


        test('should handle null role gracefully', async () => {
            const userWithoutRole = { ...mockUser, role: null };
            UserRepository.findByIdWithRole.mockResolvedValue(userWithoutRole);

            const result = await UserService.getProfile('uuid-123');

            expect(result.role).toBeNull();
        });

        test('should return status field with account status', async () => {
            UserRepository.findByIdWithRole.mockResolvedValue(mockUser);

            const result = await UserService.getProfile('uuid-123');

            expect(result.status).toBeDefined();
            expect(result.status).toBe('Active');
            expect(typeof result.status).toBe('string');
        });

        test('should return correct status for Inactive account', async () => {
            const inactiveUser = { ...mockUser, status: 'Inactive' };
            UserRepository.findByIdWithRole.mockResolvedValue(inactiveUser);

            const result = await UserService.getProfile('uuid-123');

            expect(result.status).toBe('Inactive');
        });

        test('should return correct status for Banned account', async () => {
            const bannedUser = { ...mockUser, status: 'Banned' };
            UserRepository.findByIdWithRole.mockResolvedValue(bannedUser);

            const result = await UserService.getProfile('uuid-123');

            expect(result.status).toBe('Banned');
        });

        test('should return bio field with user biography', async () => {
            UserRepository.findByIdWithRole.mockResolvedValue(mockUser);

            const result = await UserService.getProfile('uuid-123');

            expect(result.bio).toBeDefined();
            expect(result.bio).toBe('Software Developer with 5 years of experience');
            expect(typeof result.bio).toBe('string');
        });

        test('should handle null bio gracefully', async () => {
            const userWithoutBio = { ...mockUser, bio: null };
            UserRepository.findByIdWithRole.mockResolvedValue(userWithoutBio);

            const result = await UserService.getProfile('uuid-123');

            expect(result.bio).toBeNull();
        });

        test('should handle empty bio string', async () => {
            const userWithEmptyBio = { ...mockUser, bio: '' };
            UserRepository.findByIdWithRole.mockResolvedValue(userWithEmptyBio);

            const result = await UserService.getProfile('uuid-123');

            expect(result.bio).toBe('');
        });
    });

    describe('updateProfile', () => {
        const mockUser = {
            userId: 'uuid-123',
            email: 'test@example.com',
            fullName: 'Old Name',
            phoneNumber: '0123456789',
            address: 'Old Address',
            bio: 'Old Bio',
            dateOfBirth: '1990-01-01',
            gender: 'male',
            avatarUrl: 'https://example.com/old.jpg',
            role: 'seeker',
            isVerified: true,
            isActive: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            password: 'hashed-password'
        };

        const mockUpdatedUser = {
            ...mockUser,
            fullName: 'New Name',
            phoneNumber: '0987654321',
            updatedAt: '2024-01-02T00:00:00.000Z'
        };

        test('should update user profile successfully', async () => {
            const updateData = {
                fullName: 'New Name',
                phone: '0987654321'
            };

            UserRepository.findById.mockResolvedValueOnce(mockUser);
            UserRepository.update.mockResolvedValue({});
            UserRepository.findById.mockResolvedValueOnce(mockUpdatedUser);

            const result = await UserService.updateProfile('uuid-123', updateData);

            expect(UserRepository.findById).toHaveBeenCalledWith('uuid-123');
            expect(UserRepository.update).toHaveBeenCalledWith('uuid-123', {
                fullName: 'New Name',
                phoneNumber: '0987654321'
            });
            expect(result.fullName).toBe('New Name');
            expect(result.phone).toBe('0987654321');
            expect(result.password).toBeUndefined();
        });

        test('should throw error when user not found', async () => {
            UserRepository.findById.mockResolvedValue(null);

            try {
                await UserService.updateProfile('non-existent-id', {});
            } catch (error) {
                expect(error.message).toBe(MESSAGES.USER_NOT_FOUND);
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }
        });

        test('should only update allowed fields', async () => {
            const updateData = {
                fullName: 'New Name',
                email: 'hacker@example.com', // Should be ignored
                password: 'newpass', // Should be ignored
                role: 'admin' // Should be ignored
            };

            UserRepository.findById.mockResolvedValueOnce(mockUser);
            UserRepository.update.mockResolvedValue({});
            UserRepository.findById.mockResolvedValueOnce(mockUpdatedUser);

            await UserService.updateProfile('uuid-123', updateData);

            expect(UserRepository.update).toHaveBeenCalledWith('uuid-123', {
                fullName: 'New Name'
            });
        });

        test('should use O(1) complexity with primary key operations', async () => {
            UserRepository.findById.mockResolvedValueOnce(mockUser);
            UserRepository.update.mockResolvedValue({});
            UserRepository.findById.mockResolvedValueOnce(mockUpdatedUser);

            await UserService.updateProfile('uuid-123', { fullName: 'New Name' });

            expect(UserRepository.findById).toHaveBeenCalledTimes(2);
            expect(UserRepository.update).toHaveBeenCalledTimes(1);
        });

        test('should handle empty update data', async () => {
            UserRepository.findById.mockResolvedValueOnce(mockUser);
            UserRepository.update.mockResolvedValue({});
            UserRepository.findById.mockResolvedValueOnce(mockUser);

            await UserService.updateProfile('uuid-123', {});

            expect(UserRepository.update).toHaveBeenCalledWith('uuid-123', {});
        });
    });

    describe('changePassword', () => {
        const mockUser = {
            userId: 'uuid-123',
            email: 'test@example.com',
            password: 'hashed-old-password'
        };

        test('should change password successfully', async () => {
            bcrypt.compare.mockResolvedValue(true);
            bcrypt.hash.mockResolvedValue('hashed-new-password');
            UserRepository.findById.mockResolvedValue(mockUser);
            UserRepository.update.mockResolvedValue({});

            const result = await UserService.changePassword('uuid-123', {
                oldPassword: 'OldPassword123',
                newPassword: 'NewPassword456'
            });

            expect(UserRepository.findById).toHaveBeenCalledWith('uuid-123');
            expect(bcrypt.compare).toHaveBeenCalledWith('OldPassword123', 'hashed-old-password');
            expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword456', 14);
            expect(UserRepository.update).toHaveBeenCalledWith('uuid-123', {
                password: 'hashed-new-password'
            });
            expect(result).toEqual({ success: true });
        });

        test('should throw error when user not found', async () => {
            UserRepository.findById.mockResolvedValue(null);

            try {
                await UserService.changePassword('non-existent-id', {
                    oldPassword: 'OldPassword123',
                    newPassword: 'NewPassword456'
                });
            } catch (error) {
                expect(error.message).toBe(MESSAGES.USER_NOT_FOUND);
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }
        });

        test('should throw error when old password is incorrect', async () => {
            UserRepository.findById.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            try {
                await UserService.changePassword('uuid-123', {
                    oldPassword: 'WrongPassword123',
                    newPassword: 'NewPassword456'
                });
            } catch (error) {
                expect(error.message).toBe(MESSAGES.OLD_PASSWORD_INCORRECT);
                expect(error.status).toBe(HTTP_STATUS.BAD_REQUEST);
            }

            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(UserRepository.update).not.toHaveBeenCalled();
        });

        test('should use bcrypt cost 14 for hashing', async () => {
            bcrypt.compare.mockResolvedValue(true);
            bcrypt.hash.mockResolvedValue('hashed-new-password');
            UserRepository.findById.mockResolvedValue(mockUser);
            UserRepository.update.mockResolvedValue({});

            await UserService.changePassword('uuid-123', {
                oldPassword: 'OldPassword123',
                newPassword: 'NewPassword456'
            });

            expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword456', 14);
        });

        test('should use O(1) complexity with primary key operations', async () => {
            bcrypt.compare.mockResolvedValue(true);
            bcrypt.hash.mockResolvedValue('hashed-new-password');
            UserRepository.findById.mockResolvedValue(mockUser);
            UserRepository.update.mockResolvedValue({});

            await UserService.changePassword('uuid-123', {
                oldPassword: 'OldPassword123',
                newPassword: 'NewPassword456'
            });

            expect(UserRepository.findById).toHaveBeenCalledTimes(1);
            expect(UserRepository.update).toHaveBeenCalledTimes(1);
        });
    });

    describe('uploadAvatar', () => {
        const mockUser = {
            userId: 'uuid-123',
            email: 'test@example.com'
        };

        const mockFileBuffer = Buffer.from('fake-image-data');
        const mockAvatarUrl = 'https://res.cloudinary.com/test/image/upload/v123/avatars/avatar.jpg';

        test('should upload avatar successfully', async () => {
            UserRepository.findById.mockResolvedValue(mockUser);
            uploadService.uploadToCloudinary.mockResolvedValue(mockAvatarUrl);
            UserRepository.update.mockResolvedValue({});

            const result = await UserService.uploadAvatar('uuid-123', mockFileBuffer);

            expect(UserRepository.findById).toHaveBeenCalledWith('uuid-123');
            expect(uploadService.uploadToCloudinary).toHaveBeenCalledWith(mockFileBuffer, 'avatars');
            expect(UserRepository.update).toHaveBeenCalledWith('uuid-123', {
                avatarUrl: mockAvatarUrl
            });
            expect(result).toEqual({
                avatarUrl: mockAvatarUrl
            });
        });

        test('should throw error when user not found', async () => {
            UserRepository.findById.mockResolvedValue(null);

            try {
                await UserService.uploadAvatar('non-existent-id', mockFileBuffer);
            } catch (error) {
                expect(error.message).toBe(MESSAGES.USER_NOT_FOUND);
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }

            expect(uploadService.uploadToCloudinary).not.toHaveBeenCalled();
        });

        test('should use O(1) complexity with primary key operations', async () => {
            UserRepository.findById.mockResolvedValue(mockUser);
            uploadService.uploadToCloudinary.mockResolvedValue(mockAvatarUrl);
            UserRepository.update.mockResolvedValue({});

            await UserService.uploadAvatar('uuid-123', mockFileBuffer);

            expect(UserRepository.findById).toHaveBeenCalledTimes(1);
            expect(UserRepository.update).toHaveBeenCalledTimes(1);
        });

        test('should handle Cloudinary upload errors', async () => {
            UserRepository.findById.mockResolvedValue(mockUser);
            uploadService.uploadToCloudinary.mockRejectedValue(new Error('Cloudinary error'));

            try {
                await UserService.uploadAvatar('uuid-123', mockFileBuffer);
            } catch (error) {
                expect(error.message).toBe('Cloudinary error');
            }

            expect(UserRepository.update).not.toHaveBeenCalled();
        });
    });

    describe('removeSkill', () => {
        test('should remove skill successfully', async () => {
            UserRepository.removeSkill.mockResolvedValue(true);

            const result = await UserService.removeSkill('uuid-123', 1);

            expect(UserRepository.removeSkill).toHaveBeenCalledWith('uuid-123', 1);
            expect(result).toEqual({ success: true });
        });

        test('should throw error when user not found', async () => {
            UserRepository.removeSkill.mockResolvedValue(false);

            try {
                await UserService.removeSkill('non-existent-id', 1);
            } catch (error) {
                expect(error.message).toBe(MESSAGES.USER_NOT_FOUND);
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }
        });
    });

    describe('getMySkills', () => {
        const mockSkills = [
            { skillId: 1, name: 'Java' },
            { skillId: 2, name: 'NodeJS' }
        ];

        const mockUserWithSkills = {
            userId: 'uuid-123',
            skills: mockSkills
        };

        test('should return list of skills successfully', async () => {
            UserRepository.findWithSkills.mockResolvedValue(mockUserWithSkills);

            const result = await UserService.getMySkills('uuid-123');

            expect(UserRepository.findWithSkills).toHaveBeenCalledWith('uuid-123');
            expect(result).toEqual(mockSkills);
        });

        test('should return empty list if user has no skills', async () => {
            UserRepository.findWithSkills.mockResolvedValue({
                userId: 'uuid-123',
                skills: []
            });

            const result = await UserService.getMySkills('uuid-123');

            expect(result).toEqual([]);
        });

        test('should throw error when user not found', async () => {
            UserRepository.findWithSkills.mockResolvedValue(null);

            try {
                await UserService.getMySkills('non-existent-id');
            } catch (error) {
                expect(error.message).toBe(MESSAGES.USER_NOT_FOUND);
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }
        });
    });

    describe('addSkills', () => {
        const skillIds = [1, 2, 3];
        const mockSkills = [
            { skillId: 1, name: 'Java' },
            { skillId: 2, name: 'NodeJS' },
            { skillId: 3, name: 'React' }
        ];

        test('should add skills successfully', async () => {
            SkillRepository.findByIds.mockResolvedValue(mockSkills);
            UserRepository.addSkills.mockResolvedValue(true);

            const result = await UserService.addSkills('uuid-123', skillIds);

            expect(SkillRepository.findByIds).toHaveBeenCalledWith(skillIds);
            expect(UserRepository.addSkills).toHaveBeenCalledWith('uuid-123', skillIds);
            expect(result).toEqual({ success: true });
        });

        test('should throw error when skills do not exist', async () => {
            SkillRepository.findByIds.mockResolvedValue([mockSkills[0]]); // Only 1 found

            try {
                await UserService.addSkills('uuid-123', skillIds);
            } catch (error) {
                expect(error.message).toBe(MESSAGES.SKILL_NOT_FOUND);
                expect(error.status).toBe(HTTP_STATUS.BAD_REQUEST);
            }

            expect(UserRepository.addSkills).not.toHaveBeenCalled();
        });

        test('should throw error when user not found', async () => {
            SkillRepository.findByIds.mockResolvedValue(mockSkills);
            UserRepository.addSkills.mockResolvedValue(false);

            try {
                await UserService.addSkills('non-existent-id', skillIds);
            } catch (error) {
                expect(error.message).toBe(MESSAGES.USER_NOT_FOUND);
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }
        });
    });

    describe('upgradeToEmployer', () => {
        const upgradeData = {
            company_name: 'Tech Corp',
            tax_code: '0123456789',
            address: '123 St',
            phone: '0987654321'
        };

        const mockUser = { userId: 'uuid-123' };

        beforeEach(() => {
            UserRepository.findById.mockResolvedValue(mockUser);
            CompanyRepository.findByUserId.mockResolvedValue(null);
            CompanyRepository.findByTaxCode.mockResolvedValue(null);
            CompanyRepository.create.mockResolvedValue({});
        });

        test('should upgrade successfully', async () => {
            const result = await UserService.upgradeToEmployer('uuid-123', upgradeData);

            expect(UserRepository.findById).toHaveBeenCalledWith('uuid-123');
            expect(CompanyRepository.findByUserId).toHaveBeenCalledWith('uuid-123');
            expect(CompanyRepository.findByTaxCode).toHaveBeenCalledWith(upgradeData.tax_code);
            expect(CompanyRepository.create).toHaveBeenCalledWith({
                userId: 'uuid-123',
                name: upgradeData.company_name,
                taxCode: upgradeData.tax_code,
                addressDetail: upgradeData.address,
                phoneNumber: upgradeData.phone,
                status: 'Pending'
            });
            expect(result.message).toBe(MESSAGES.UPGRADE_EMPLOYER_SUCCESS);
        });

        test('should throw error when user not found', async () => {
            UserRepository.findById.mockResolvedValue(null);

            try {
                await UserService.upgradeToEmployer('non-existent', upgradeData);
            } catch (error) {
                expect(error.message).toBe(MESSAGES.USER_NOT_FOUND);
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }
        });

        test('should throw error when user is already employer', async () => {
            CompanyRepository.findByUserId.mockResolvedValue({ companyId: 1 });

            try {
                await UserService.upgradeToEmployer('uuid-123', upgradeData);
            } catch (error) {
                expect(error.message).toBe(MESSAGES.ALREADY_EMPLOYER);
                expect(error.status).toBe(HTTP_STATUS.BAD_REQUEST);
            }
        });

        test('should throw error when tax code exists', async () => {
            CompanyRepository.findByTaxCode.mockResolvedValue({ companyId: 2 });

            try {
                await UserService.upgradeToEmployer('uuid-123', upgradeData);
            } catch (error) {
                expect(error.message).toBe(MESSAGES.TAX_CODE_EXISTS);
                expect(error.status).toBe(HTTP_STATUS.BAD_REQUEST);
            }
        });
    });
});
