const UserController = require('../../src/controllers/UserController');
const UserService = require('../../src/services/UserService');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/services/UserService');

describe('UserController', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: {
                userId: 'uuid-123'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('getProfile', () => {
        const mockProfile = {
            userId: 'uuid-123',
            email: 'test@example.com',
            fullName: 'Test User',
            phone: '0123456789',
            role: 'seeker'
        };

        test('should return 200 and user profile on success', async () => {
            UserService.getProfile.mockResolvedValue(mockProfile);

            await UserController.getProfile(req, res, next);

            expect(UserService.getProfile).toHaveBeenCalledWith('uuid-123');
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.GET_PROFILE_SUCCESS,
                data: mockProfile
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should call next with error when service fails', async () => {
            const mockError = new Error(MESSAGES.USER_NOT_FOUND);
            mockError.status = HTTP_STATUS.NOT_FOUND;
            UserService.getProfile.mockRejectedValue(mockError);

            await UserController.getProfile(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test('should not contain business logic', async () => {
            UserService.getProfile.mockResolvedValue(mockProfile);

            await UserController.getProfile(req, res, next);

            expect(UserService.getProfile).toHaveBeenCalledTimes(1);
        });
    });

    describe('updateProfile', () => {
        const mockUpdatedProfile = {
            userId: 'uuid-123',
            email: 'test@example.com',
            fullName: 'Updated Name',
            phone: '0987654321',
            role: 'seeker'
        };

        test('should return 200 and updated profile on success', async () => {
            req.body = {
                fullName: 'Updated Name',
                phone: '0987654321'
            };

            UserService.updateProfile.mockResolvedValue(mockUpdatedProfile);

            await UserController.updateProfile(req, res, next);

            expect(UserService.updateProfile).toHaveBeenCalledWith('uuid-123', req.body);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.UPDATE_PROFILE_SUCCESS,
                data: mockUpdatedProfile
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should call next with error when service fails', async () => {
            const mockError = new Error(MESSAGES.USER_NOT_FOUND);
            mockError.status = HTTP_STATUS.NOT_FOUND;
            UserService.updateProfile.mockRejectedValue(mockError);

            await UserController.updateProfile(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test('should not contain business logic', async () => {
            req.body = { fullName: 'New Name' };
            UserService.updateProfile.mockResolvedValue(mockUpdatedProfile);

            await UserController.updateProfile(req, res, next);

            expect(UserService.updateProfile).toHaveBeenCalledTimes(1);
        });
    });

    describe('changePassword', () => {
        test('should return 200 and success message on password change', async () => {
            req.body = {
                oldPassword: 'OldPassword123',
                newPassword: 'NewPassword456'
            };

            UserService.changePassword.mockResolvedValue({ success: true });

            await UserController.changePassword(req, res, next);

            expect(UserService.changePassword).toHaveBeenCalledWith('uuid-123', req.body);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.CHANGE_PASSWORD_SUCCESS
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should call next with error when old password is incorrect', async () => {
            const mockError = new Error(MESSAGES.OLD_PASSWORD_INCORRECT);
            mockError.status = HTTP_STATUS.BAD_REQUEST;
            UserService.changePassword.mockRejectedValue(mockError);

            await UserController.changePassword(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test('should call next with error when user not found', async () => {
            const mockError = new Error(MESSAGES.USER_NOT_FOUND);
            mockError.status = HTTP_STATUS.NOT_FOUND;
            UserService.changePassword.mockRejectedValue(mockError);

            await UserController.changePassword(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });

        test('should not contain business logic', async () => {
            req.body = {
                oldPassword: 'OldPassword123',
                newPassword: 'NewPassword456'
            };
            UserService.changePassword.mockResolvedValue({ success: true });

            await UserController.changePassword(req, res, next);

            expect(UserService.changePassword).toHaveBeenCalledTimes(1);
        });
    });

    describe('uploadAvatar', () => {
        const mockAvatarUrl = 'https://res.cloudinary.com/test/avatar.jpg';

        test('should return 200 and avatar URL on successful upload', async () => {
            req.file = {
                buffer: Buffer.from('fake-image-data')
            };

            UserService.uploadAvatar.mockResolvedValue({ avatarUrl: mockAvatarUrl });

            await UserController.uploadAvatar(req, res, next);

            expect(UserService.uploadAvatar).toHaveBeenCalledWith('uuid-123', req.file.buffer);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.UPLOAD_AVATAR_SUCCESS,
                data: {
                    avatarUrl: mockAvatarUrl
                }
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should return 400 when file is missing', async () => {
            req.file = null;

            await UserController.uploadAvatar(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: MESSAGES.FILE_REQUIRED,
                    status: HTTP_STATUS.BAD_REQUEST
                })
            );
            expect(UserService.uploadAvatar).not.toHaveBeenCalled();
        });

        test('should call next with error when service fails', async () => {
            req.file = {
                buffer: Buffer.from('fake-image-data')
            };

            const mockError = new Error('Upload failed');
            UserService.uploadAvatar.mockRejectedValue(mockError);

            await UserController.uploadAvatar(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should not contain business logic', async () => {
            req.file = {
                buffer: Buffer.from('fake-image-data')
            };

            UserService.uploadAvatar.mockResolvedValue({ avatarUrl: mockAvatarUrl });

            await UserController.uploadAvatar(req, res, next);

            expect(UserService.uploadAvatar).toHaveBeenCalledTimes(1);
        });
    });

    describe('getMySkills', () => {
        const mockSkills = [
            { skillId: 1, name: 'Java' },
            { skillId: 2, name: 'NodeJS' }
        ];

        test('should return 200 and skills list on success', async () => {
            UserService.getMySkills.mockResolvedValue(mockSkills);

            await UserController.getMySkills(req, res, next);

            expect(UserService.getMySkills).toHaveBeenCalledWith('uuid-123');
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.GET_MY_SKILLS_SUCCESS,
                data: mockSkills
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should call next with error when service fails', async () => {
            const mockError = new Error(MESSAGES.USER_NOT_FOUND);
            mockError.status = HTTP_STATUS.NOT_FOUND;
            UserService.getMySkills.mockRejectedValue(mockError);

            await UserController.getMySkills(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('addSkills', () => {
        test('should return 201 and success message on success', async () => {
            req.body = {
                skillIds: [1, 2, 3]
            };

            UserService.addSkills.mockResolvedValue({ success: true });

            await UserController.addSkills(req, res, next);

            expect(UserService.addSkills).toHaveBeenCalledWith('uuid-123', req.body.skillIds);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.ADD_SKILLS_SUCCESS
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should call next with error when service fails', async () => {
            req.body = {
                skillIds: [1, 2, 3]
            };

            const mockError = new Error(MESSAGES.SKILL_NOT_FOUND);
            mockError.status = HTTP_STATUS.BAD_REQUEST;
            UserService.addSkills.mockRejectedValue(mockError);

            await UserController.addSkills(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('removeSkill', () => {
        test('should return 200 and success message on success', async () => {
            req.params = { skillId: 1 };
            UserService.removeSkill.mockResolvedValue({ success: true });

            await UserController.removeSkill(req, res, next);

            expect(UserService.removeSkill).toHaveBeenCalledWith('uuid-123', 1);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.DELETE_SKILL_SUCCESS
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should call next with error when service fails', async () => {
            req.params = { skillId: 1 };
            const mockError = new Error(MESSAGES.USER_NOT_FOUND);
            mockError.status = HTTP_STATUS.NOT_FOUND;
            UserService.removeSkill.mockRejectedValue(mockError);

            await UserController.removeSkill(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('upgradeToEmployer', () => {
        const upgradeReq = {
            company_name: 'Tech Corp',
            tax_code: '0123456789'
        };

        test('should return 200 and success message on success', async () => {
            req.body = upgradeReq;
            UserService.upgradeToEmployer.mockResolvedValue({
                message: MESSAGES.UPGRADE_EMPLOYER_SUCCESS
            });

            await UserController.upgradeToEmployer(req, res, next);

            expect(UserService.upgradeToEmployer).toHaveBeenCalledWith('uuid-123', req.body);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.UPGRADE_EMPLOYER_SUCCESS
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should call next with error when service fails', async () => {
            req.body = upgradeReq;
            const mockError = new Error(MESSAGES.ALREADY_EMPLOYER);
            mockError.status = HTTP_STATUS.BAD_REQUEST;
            UserService.upgradeToEmployer.mockRejectedValue(mockError);

            await UserController.upgradeToEmployer(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
        });
    });
});
