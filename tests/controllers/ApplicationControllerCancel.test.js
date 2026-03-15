const ApplicationController = require('../../src/controllers/ApplicationController');
const ApplicationService = require('../../src/services/ApplicationService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/ApplicationService');

const buildReq = (applicationId = 10) => ({
    user: { userId: 'user-uuid-123' },
    params: { applicationId },
    validatedParams: { applicationId }
});

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};

const next = jest.fn();

describe('ApplicationController.cancelApplication', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 with success message when cancellation is successful', async () => {
        ApplicationService.cancelApplication.mockResolvedValue(undefined);

        await ApplicationController.cancelApplication(buildReq(), res, next);

        expect(ApplicationService.cancelApplication).toHaveBeenCalledWith(10, 'user-uuid-123');
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: MESSAGES.CANCEL_APPLICATION_SUCCESS
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error when service throws NOT_FOUND', async () => {
        const error = Object.assign(new Error(MESSAGES.APPLICATION_NOT_FOUND), {
            status: HTTP_STATUS.NOT_FOUND
        });
        ApplicationService.cancelApplication.mockRejectedValue(error);

        await ApplicationController.cancelApplication(buildReq(), res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with error when service throws BAD_REQUEST (already viewed)', async () => {
        const error = Object.assign(new Error(MESSAGES.APPLICATION_CANNOT_BE_CANCELLED), {
            status: HTTP_STATUS.BAD_REQUEST
        });
        ApplicationService.cancelApplication.mockRejectedValue(error);

        await ApplicationController.cancelApplication(buildReq(), res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
