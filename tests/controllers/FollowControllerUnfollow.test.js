const FollowController = require('../../src/controllers/FollowController');
const FollowService = require('../../src/services/FollowService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/FollowService');

const req = {
    user: { userId: 'user-123' },
    params: { companyId: 'company-456' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('FollowController.unfollowCompany', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and success message', async () => {
        FollowService.unfollowCompany.mockResolvedValue(true);

        await FollowController.unfollowCompany(req, res, next);

        expect(FollowService.unfollowCompany).toHaveBeenCalledWith('user-123', 'company-456');
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.UNFOLLOW_SUCCESS
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        FollowService.unfollowCompany.mockRejectedValue(error);

        await FollowController.unfollowCompany(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
