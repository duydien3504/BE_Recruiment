const FollowController = require('../../src/controllers/FollowController');
const FollowService = require('../../src/services/FollowService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/FollowService');

const req = {
    user: { userId: 'user-123' },
    body: { companyId: 'company-456' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('FollowController.followCompany', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 201 and success message', async () => {
        FollowService.followCompany.mockResolvedValue({ userId: 'user-123', companyId: 'company-456' });

        await FollowController.followCompany(req, res, next);

        expect(FollowService.followCompany).toHaveBeenCalledWith('user-123', 'company-456');
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.FOLLOW_SUCCESS
        });
    });

    it('should throw BAD_REQUEST if companyId is missing', async () => {
        const invalidReq = { ...req, body: {} };
        await FollowController.followCompany(invalidReq, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        FollowService.followCompany.mockRejectedValue(error);

        await FollowController.followCompany(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
