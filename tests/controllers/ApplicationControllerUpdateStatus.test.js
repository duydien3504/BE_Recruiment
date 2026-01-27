const ApplicationController = require('../../src/controllers/ApplicationController');
const ApplicationService = require('../../src/services/ApplicationService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/ApplicationService');

const req = {
    user: { userId: 'user-123' },
    params: { id: 1 },
    body: { status: 'Interview', note: 'Notes' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('ApplicationController.updateApplicationStatus', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and success message', async () => {
        ApplicationService.updateApplicationStatus.mockResolvedValue(true);

        await ApplicationController.updateApplicationStatus(req, res, next);

        expect(ApplicationService.updateApplicationStatus).toHaveBeenCalledWith('user-123', 1, 'Interview', 'Notes');
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.UPDATE_APPLICATION_STATUS_SUCCESS
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        ApplicationService.updateApplicationStatus.mockRejectedValue(error);

        await ApplicationController.updateApplicationStatus(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });

    it('should throw BAD_REQUEST if status missing', async () => {
        const invalidReq = { ...req, body: {} };
        await ApplicationController.updateApplicationStatus(invalidReq, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
});
