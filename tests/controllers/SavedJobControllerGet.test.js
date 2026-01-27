const SavedJobController = require('../../src/controllers/SavedJobController');
const SavedJobService = require('../../src/services/SavedJobService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/SavedJobService');

const req = {
    user: { userId: 'user-123' }
};
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};
const next = jest.fn();

describe('SavedJobController.getSavedJobs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and saved jobs list', async () => {
        const mockSavedJobs = [{ jobPostId: 1 }];
        SavedJobService.getSavedJobs.mockResolvedValue(mockSavedJobs);

        await SavedJobController.getSavedJobs(req, res, next);

        expect(SavedJobService.getSavedJobs).toHaveBeenCalledWith('user-123');
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: MESSAGES.GET_SAVED_JOBS_SUCCESS,
            data: mockSavedJobs
        });
    });

    it('should call next with error when service fails', async () => {
        const error = new Error('Service Error');
        SavedJobService.getSavedJobs.mockRejectedValue(error);

        await SavedJobController.getSavedJobs(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
