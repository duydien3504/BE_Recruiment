const ApplicationController = require('../../src/controllers/ApplicationController');
const ApplicationService = require('../../src/services/ApplicationService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/ApplicationService');

const req = {
    user: { userId: 'user-123' },
    params: { jobId: 1 }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('ApplicationController.getJobApplications', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and applications list', async () => {
        const mockApps = [{ applicationId: 1 }];
        ApplicationService.getJobApplications.mockResolvedValue(mockApps);

        await ApplicationController.getJobApplications(req, res, next);

        expect(ApplicationService.getJobApplications).toHaveBeenCalledWith('user-123', 1);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.GET_JOB_APPLICATIONS_SUCCESS,
            data: mockApps
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        ApplicationService.getJobApplications.mockRejectedValue(error);

        await ApplicationController.getJobApplications(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
