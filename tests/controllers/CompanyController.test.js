const CompanyController = require('../../src/controllers/CompanyController');
const CompanyService = require('../../src/services/CompanyService');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/services/CompanyService');

describe('CompanyController', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: { userId: 'uuid-123' },
            body: {},
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('getMyCompany', () => {
        const mockCompany = {
            companyId: 'uuid-123',
            name: 'Tech Corp'
        };

        test('should return 200 and company info on success', async () => {
            CompanyService.getMyCompany.mockResolvedValue(mockCompany);

            await CompanyController.getMyCompany(req, res, next);

            expect(CompanyService.getMyCompany).toHaveBeenCalledWith('uuid-123');
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.GET_COMPANY_SUCCESS,
                data: mockCompany
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should call next with error when service fails', async () => {
            // Error case: User is not an employer (Company not found)
            const mockError = new Error(MESSAGES.COMPANY_NOT_FOUND);
            mockError.status = HTTP_STATUS.NOT_FOUND;
            CompanyService.getMyCompany.mockRejectedValue(mockError);

            await CompanyController.getMyCompany(req, res, next);

            expect(CompanyService.getMyCompany).toHaveBeenCalledWith('uuid-123');
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('updateMyCompany', () => {
        test('should return 200 and success message on success', async () => {
            req.user.userId = 'uuid-123';
            req.body = { name: 'Updated Name' };

            CompanyService.updateMyCompany.mockResolvedValue({});

            await CompanyController.updateMyCompany(req, res, next);

            expect(CompanyService.updateMyCompany).toHaveBeenCalledWith('uuid-123', req.body);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.UPDATE_COMPANY_SUCCESS
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should call next with error when service fails', async () => {
            req.user.userId = 'uuid-123';
            const mockError = new Error(MESSAGES.COMPANY_NOT_FOUND);
            CompanyService.updateMyCompany.mockRejectedValue(mockError);

            await CompanyController.updateMyCompany(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('uploadLogo', () => {
        test('should return 200 and logo url on success', async () => {
            req.user.userId = 'uuid-123';
            req.file = { buffer: Buffer.from('test') };
            const mockLogoUrl = 'https://cloudinary/logo.png';

            CompanyService.uploadLogo.mockResolvedValue(mockLogoUrl);

            await CompanyController.uploadLogo(req, res, next);

            expect(CompanyService.uploadLogo).toHaveBeenCalledWith('uuid-123', req.file.buffer);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.UPLOAD_LOGO_SUCCESS,
                logo_url: mockLogoUrl
            });
        });

        test('should throw error when file is missing', async () => {
            req.user.userId = 'uuid-123';
            req.file = undefined;

            await CompanyController.uploadLogo(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.anything());
            // Check error message or status is handled by handler
        });
    });

    describe('uploadBackground', () => {
        test('should return 200 and background url on success', async () => {
            req.user.userId = 'uuid-123';
            req.file = { buffer: Buffer.from('test') };
            const mockUrl = 'https://cloudinary/bg.png';

            CompanyService.uploadBackground.mockResolvedValue(mockUrl);

            await CompanyController.uploadBackground(req, res, next);

            expect(CompanyService.uploadBackground).toHaveBeenCalledWith('uuid-123', req.file.buffer);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.UPLOAD_BACKGROUND_SUCCESS,
                background_url: mockUrl
            });
        });

        test('should throw error when file is missing', async () => {
            req.user.userId = 'uuid-123';
            req.file = undefined;

            await CompanyController.uploadBackground(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.anything());
        });
    });

    describe('getCompanyDetail', () => {
        test('should return 200 and company data on success', async () => {
            req.params = { id: 'uuid-123' };
            const mockCompany = { companyId: 'uuid-123', name: 'Tech Corp' };

            CompanyService.getCompanyDetail.mockResolvedValue(mockCompany);

            await CompanyController.getCompanyDetail(req, res, next);

            expect(CompanyService.getCompanyDetail).toHaveBeenCalledWith('uuid-123');
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.GET_COMPANY_SUCCESS,
                data: mockCompany
            });
        });

        test('should call next with error when service fails', async () => {
            req.params = { id: 'uuid-123' };
            const mockError = new Error(MESSAGES.COMPANY_NOT_FOUND);
            CompanyService.getCompanyDetail.mockRejectedValue(mockError);

            await CompanyController.getCompanyDetail(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    describe('getCompanies', () => {
        test('should return 200 and list of companies', async () => {
            req.query = { page: 1, limit: 10 };
            const mockResult = {
                data: [],
                pagination: { total: 0 }
            };

            CompanyService.getCompanies.mockResolvedValue(mockResult);

            await CompanyController.getCompanies(req, res, next);

            expect(CompanyService.getCompanies).toHaveBeenCalledWith(req.query);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.GET_COMPANIES_SUCCESS,
                ...mockResult
            });
        });

        test('should call next with error when service fails', async () => {
            const mockError = new Error('Database error');
            CompanyService.getCompanies.mockRejectedValue(mockError);

            await CompanyController.getCompanies(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    describe('getCompanyJobs', () => {
        test('should return 200 and list of jobs', async () => {
            req.params = { id: 'uuid-123' };
            const mockJobs = [{ id: 1, title: 'Job A' }];

            CompanyService.getCompanyJobs.mockResolvedValue(mockJobs);

            await CompanyController.getCompanyJobs(req, res, next);

            expect(CompanyService.getCompanyJobs).toHaveBeenCalledWith('uuid-123');
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.GET_COMPANY_JOBS_SUCCESS,
                data: mockJobs
            });
        });

        test('should call next with error when service fails', async () => {
            req.params = { id: 'uuid-123' };
            const mockError = new Error(MESSAGES.COMPANY_NOT_FOUND);
            CompanyService.getCompanyJobs.mockRejectedValue(mockError);

            await CompanyController.getCompanyJobs(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });
    });
});
