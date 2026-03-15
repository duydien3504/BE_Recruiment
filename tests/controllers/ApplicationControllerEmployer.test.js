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

describe('ApplicationController.getEmployerApplications', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 with paginated employer applications', async () => {
        const mockReq = {
            user: { userId: 'user-123' },
            validatedQuery: { page: 1, limit: 10 }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockData = {
            applications: [],
            pagination: {
                currentPage: 1,
                totalPages: 0,
                totalItems: 0,
                limit: 10
            }
        };
        ApplicationService.getEmployerApplications.mockResolvedValue(mockData);

        await ApplicationController.getEmployerApplications(mockReq, mockRes, next);

        expect(ApplicationService.getEmployerApplications).toHaveBeenCalledWith('user-123', { page: 1, limit: 10 });
        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: true,
            message: MESSAGES.GET_JOB_APPLICATIONS_SUCCESS,
            data: mockData
        });
    });
});

describe('ApplicationController.downloadEmployerApplicationCv', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and stream pdf file', async () => {
        const fileBuffer = Buffer.from('%PDF-1.4');
        const mockReq = {
            user: { userId: 'user-123' },
            validatedParams: { applicationId: 100 }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            setHeader: jest.fn(),
            send: jest.fn()
        };
        const mockData = {
            fileName: 'cv.pdf',
            contentType: 'application/pdf',
            fileBuffer
        };
        ApplicationService.downloadCvForEmployer.mockResolvedValue(mockData);

        await ApplicationController.downloadEmployerApplicationCv(mockReq, mockRes, next);

        expect(ApplicationService.downloadCvForEmployer).toHaveBeenCalledWith('user-123', 100);
        expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
        expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Disposition', "attachment; filename*=UTF-8''cv.pdf");
        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(mockRes.send).toHaveBeenCalledWith(fileBuffer);
    });
});
