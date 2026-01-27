const ApplicationController = require('../../src/controllers/ApplicationController');
const ApplicationService = require('../../src/services/ApplicationService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/ApplicationService');

const req = {
    user: { userId: 'user-123' },
    params: { id: 1 }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('ApplicationController.getEmployerApplicationDetail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and application detail', async () => {
        const mockApp = { applicationId: 1, status: 'Viewed' };
        ApplicationService.getEmployerApplicationDetail.mockResolvedValue(mockApp);

        await ApplicationController.getEmployerApplicationDetail(req, res, next);

        expect(ApplicationService.getEmployerApplicationDetail).toHaveBeenCalledWith('user-123', 1);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.GET_APPLICATION_DETAIL_SUCCESS,
            data: mockApp
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        ApplicationService.getEmployerApplicationDetail.mockRejectedValue(error);

        await ApplicationController.getEmployerApplicationDetail(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
