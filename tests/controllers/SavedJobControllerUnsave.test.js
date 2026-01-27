const SavedJobController = require('../../src/controllers/SavedJobController');
const SavedJobService = require('../../src/services/SavedJobService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/SavedJobService');

const req = {
    user: { userId: 'user-123' },
    params: { id: 1 }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('SavedJobController.unsaveJob', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and success message', async () => {
        SavedJobService.unsaveJob.mockResolvedValue(true);

        await SavedJobController.unsaveJob(req, res, next);

        expect(SavedJobService.unsaveJob).toHaveBeenCalledWith('user-123', 1);
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.UNSAVE_JOB_SUCCESS
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        SavedJobService.unsaveJob.mockRejectedValue(error);

        await SavedJobController.unsaveJob(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
