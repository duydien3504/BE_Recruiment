const FollowController = require('../../src/controllers/FollowController');
const FollowService = require('../../src/services/FollowService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/FollowService');

const req = {
    user: { userId: 'user-123' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('FollowController.getFollowedCompanies', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and followed companies list', async () => {
        const mockCompanies = [{ companyId: 'comp-1' }];
        FollowService.getFollowedCompanies.mockResolvedValue(mockCompanies);

        await FollowController.getFollowedCompanies(req, res, next);

        expect(FollowService.getFollowedCompanies).toHaveBeenCalledWith('user-123');
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.GET_FOLLOWED_COMPANIES_SUCCESS,
            data: mockCompanies
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        FollowService.getFollowedCompanies.mockRejectedValue(error);

        await FollowController.getFollowedCompanies(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
