const UserController = require('../../src/controllers/UserController');
const UserService = require('../../src/services/UserService');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/services/UserService');

describe('UserController', () => {
    let req, res, next;

    beforeEach(() => {
        req = { user: { userId: 'uuid-123' }, headers: {}, connection: { remoteAddress: '127.0.0.1' } };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
        jest.clearAllMocks();
    });

    // ==================== getProfile ====================
    describe('getProfile', () => {
        const mockProfile = { userId: 'uuid-123', email: 'test@example.com', fullName: 'Test User', role: 'CANDIDATE', status: 'Active' };

        test('should return 200 and user profile on success', async () => {
            UserService.getProfile.mockResolvedValue(mockProfile);
            await UserController.getProfile(req, res, next);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({ message: MESSAGES.GET_PROFILE_SUCCESS, data: mockProfile });
        });

        test('should call next with error when service fails', async () => {
            const mockError = new Error(MESSAGES.USER_NOT_FOUND);
            UserService.getProfile.mockRejectedValue(mockError);
            await UserController.getProfile(req, res, next);
            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    // ==================== updateProfile ====================
    describe('updateProfile', () => {
        test('should return 200 on success', async () => {
            req.body = { fullName: 'Updated Name' };
            const mockResult = { userId: 'uuid-123', fullName: 'Updated Name' };
            UserService.updateProfile.mockResolvedValue(mockResult);
            await UserController.updateProfile(req, res, next);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({ message: MESSAGES.UPDATE_PROFILE_SUCCESS, data: mockResult });
        });

        test('should call next with error when service fails', async () => {
            const mockError = new Error(MESSAGES.USER_NOT_FOUND);
            UserService.updateProfile.mockRejectedValue(mockError);
            await UserController.updateProfile(req, res, next);
            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    // ==================== changePassword ====================
    describe('changePassword', () => {
        test('should return 200 on success', async () => {
            req.body = { oldPassword: 'Old123', newPassword: 'New456' };
            UserService.changePassword.mockResolvedValue({ success: true });
            await UserController.changePassword(req, res, next);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({ message: MESSAGES.CHANGE_PASSWORD_SUCCESS });
        });

        test('should call next with error when service fails', async () => {
            const mockError = new Error(MESSAGES.OLD_PASSWORD_INCORRECT);
            UserService.changePassword.mockRejectedValue(mockError);
            await UserController.changePassword(req, res, next);
            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    // ==================== uploadAvatar ====================
    describe('uploadAvatar', () => {
        test('should return 200 on success', async () => {
            req.file = { buffer: Buffer.from('fake') };
            UserService.uploadAvatar.mockResolvedValue({ avatarUrl: 'https://example.com/avatar.jpg' });
            await UserController.uploadAvatar(req, res, next);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        });

        test('should return 400 when file is missing', async () => {
            req.file = null;
            await UserController.uploadAvatar(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: MESSAGES.FILE_REQUIRED }));
        });
    });

    // ==================== getMySkills ====================
    describe('getMySkills', () => {
        test('should return 200 and skills list', async () => {
            const mockSkills = [{ skillId: 1, name: 'Java' }];
            UserService.getMySkills.mockResolvedValue(mockSkills);
            await UserController.getMySkills(req, res, next);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({ message: MESSAGES.GET_MY_SKILLS_SUCCESS, data: mockSkills });
        });
    });

    // ==================== addSkills ====================
    describe('addSkills', () => {
        test('should return 201 on success', async () => {
            req.body = { skillIds: [1, 2] };
            UserService.addSkills.mockResolvedValue({ success: true });
            await UserController.addSkills(req, res, next);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
        });
    });

    // ==================== removeSkill ====================
    describe('removeSkill', () => {
        test('should return 200 on success', async () => {
            req.params = { skillId: 1 };
            UserService.removeSkill.mockResolvedValue({ success: true });
            await UserController.removeSkill(req, res, next);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        });
    });

    // ==================== upgradeToEmployer ====================
    describe('upgradeToEmployer', () => {
        test('should return 200 with paymentUrl and transactionId on success', async () => {
            req.body = { company_name: 'Tech Corp', tax_code: '0123456789' };
            UserService.upgradeToEmployer.mockResolvedValue({
                message: MESSAGES.UPGRADE_EMPLOYER_SUCCESS,
                paymentUrl: 'https://momo.vn/pay?test=1',
                transactionId: 100
            });

            await UserController.upgradeToEmployer(req, res, next);

            expect(UserService.upgradeToEmployer).toHaveBeenCalledWith('uuid-123', req.body, '127.0.0.1');
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.UPGRADE_EMPLOYER_SUCCESS,
                data: { paymentUrl: 'https://momo.vn/pay?test=1', transactionId: 100 }
            });
        });

        test('should resolve IP from x-forwarded-for header', async () => {
            req.body = { company_name: 'Corp', tax_code: '111' };
            req.headers = { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' };
            UserService.upgradeToEmployer.mockResolvedValue({
                message: MESSAGES.UPGRADE_EMPLOYER_SUCCESS, paymentUrl: 'url', transactionId: 1
            });

            await UserController.upgradeToEmployer(req, res, next);

            expect(UserService.upgradeToEmployer).toHaveBeenCalledWith('uuid-123', req.body, '192.168.1.1');
        });

        test('should call next with error when service fails', async () => {
            req.body = { company_name: 'Corp', tax_code: '111' };
            const mockError = new Error(MESSAGES.ALREADY_EMPLOYER);
            UserService.upgradeToEmployer.mockRejectedValue(mockError);
            await UserController.upgradeToEmployer(req, res, next);
            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

});
