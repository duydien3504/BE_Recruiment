const UserController = require('../../src/controllers/UserController');
const UserService = require('../../src/services/UserService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/UserService');

const req = {
    query: {},
    params: { id: '1' },
    body: { status: 'Banned' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('UserController Admin Methods', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllUsers', () => {
        it('should return 200 and user list', async () => {
            const mockUsers = [{ userId: '1' }];
            UserService.getAllUsers.mockResolvedValue(mockUsers);

            await UserController.getAllUsers(req, res, next);

            expect(UserService.getAllUsers).toHaveBeenCalledWith(req.query);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.GET_USERS_SUCCESS,
                data: mockUsers
            });
        });
    });

    describe('getUserDetail', () => {
        it('should return 200 and user detail', async () => {
            const mockUser = { userId: '1' };
            UserService.getUserDetailForAdmin.mockResolvedValue(mockUser);

            await UserController.getUserDetail(req, res, next);

            expect(UserService.getUserDetailForAdmin).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        });
    });

    describe('updateUserStatus', () => {
        it('should return 200 and success message', async () => {
            UserService.updateUserStatus.mockResolvedValue(true);

            await UserController.updateUserStatus(req, res, next);

            expect(UserService.updateUserStatus).toHaveBeenCalledWith('1', 'Banned');
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        });
    });
});
