const AdminController = require('../../src/controllers/AdminController');
const CompanyService = require('../../src/services/CompanyService');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/services/CompanyService');

describe('AdminController.verifyCompany', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: { id: 'company_id_123' },
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('should successfully toggle verified status and return 200', async () => {
        const mockResult = { message: "Đã cấp tích xanh!", verified: true };
        CompanyService.verifyCompany.mockResolvedValue(mockResult);

        await AdminController.verifyCompany(req, res, next);

        expect(CompanyService.verifyCompany).toHaveBeenCalledWith('company_id_123');
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            message: mockResult.message,
            verified: mockResult.verified
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next(error) if CompanyService throws an error', async () => {
        const mockError = new Error('Company not found');
        CompanyService.verifyCompany.mockRejectedValue(mockError);

        await AdminController.verifyCompany(req, res, next);

        expect(CompanyService.verifyCompany).toHaveBeenCalledWith('company_id_123');
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(mockError);
    });
});
