const ApplicationController = require('../../src/controllers/ApplicationController');
const ApplicationService = require('../../src/services/ApplicationService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/ApplicationService');

const req = {
    user: { userId: 'user-123' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('ApplicationController.getCandidateHistory', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and history list', async () => {
        const mockApps = [{ applicationId: 1 }];
        ApplicationService.getCandidateApplications.mockResolvedValue(mockApps);

        await ApplicationController.getCandidateHistory(req, res, next);

        expect(ApplicationService.getCandidateApplications).toHaveBeenCalledWith('user-123');
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.GET_APPLICATION_HISTORY_SUCCESS,
            data: mockApps
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        ApplicationService.getCandidateApplications.mockRejectedValue(error);

        await ApplicationController.getCandidateHistory(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
