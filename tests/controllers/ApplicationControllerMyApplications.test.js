const ApplicationController = require('../../src/controllers/ApplicationController');
const ApplicationService = require('../../src/services/ApplicationService');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/services/ApplicationService');

const mockData = {
    applications: [
        {
            applicationId: 12,
            jobPostId: 5,
            jobTitle: 'Backend Node.js Developer',
            companyName: 'Tech Corp',
            coverLetter: 'Em mong muốn...',
            status: 'Pending',
            appliedAt: '2026-03-15T11:00:00.000Z'
        }
    ],
    pagination: { currentPage: 1, totalPages: 3, totalItems: 30, limit: 10 }
};

const buildReq = (validatedQuery = { page: 1, limit: 10, status: undefined }) => ({
    user: { userId: 'user-uuid-123' },
    validatedQuery
});

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};

const next = jest.fn();

describe('ApplicationController.getMyApplications', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 with success payload when service returns data', async () => {
        ApplicationService.getMyApplications.mockResolvedValue(mockData);

        await ApplicationController.getMyApplications(buildReq(), res, next);

        expect(ApplicationService.getMyApplications).toHaveBeenCalledWith('user-uuid-123', {
            status: undefined,
            page: 1,
            limit: 10
        });
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: MESSAGES.GET_MY_APPLICATIONS_SUCCESS,
            data: mockData
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return data with status filter when status query param is provided', async () => {
        ApplicationService.getMyApplications.mockResolvedValue(mockData);

        await ApplicationController.getMyApplications(
            buildReq({ page: 1, limit: 10, status: 'Accepted' }),
            res,
            next
        );

        expect(ApplicationService.getMyApplications).toHaveBeenCalledWith('user-uuid-123', {
            status: 'Accepted',
            page: 1,
            limit: 10
        });
    });

    it('should call next with error when service throws', async () => {
        const error = new Error('DB Error');
        ApplicationService.getMyApplications.mockRejectedValue(error);

        await ApplicationController.getMyApplications(buildReq(), res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.json).not.toHaveBeenCalled();
    });
});
