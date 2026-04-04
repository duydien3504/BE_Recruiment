const CompanyService = require('../../src/services/CompanyService');
const { CompanyRepository } = require('../../src/repositories');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/repositories');

describe('CompanyService.verifyCompany', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an error if company is not found', async () => {
        CompanyRepository.findById.mockResolvedValue(null);

        const companyId = 'non-existent-id';

        await expect(CompanyService.verifyCompany(companyId)).rejects.toMatchObject({
            message: "Không tìm thấy Cty.",
            status: HTTP_STATUS.NOT_FOUND,
        });

        expect(CompanyRepository.findById).toHaveBeenCalledWith(companyId);
        expect(CompanyRepository.update).not.toHaveBeenCalled();
    });

    it('should update company verified status and return updated info on success', async () => {
        const companyId = 'valid-company-id';
        const isVerified = true;
        
        const mockCompany = {
            companyId: companyId,
            name: 'Kmin Edu',
            verified: false
        };

        CompanyRepository.findById.mockResolvedValue(mockCompany);
        CompanyRepository.update.mockResolvedValue(true);

        const result = await CompanyService.verifyCompany(companyId);

        expect(CompanyRepository.findById).toHaveBeenCalledWith(companyId);
        expect(CompanyRepository.update).toHaveBeenCalledWith(companyId, { verified: true });
        expect(result).toEqual({ message: "Đã cấp tích xanh!", verified: true });
    });
});
