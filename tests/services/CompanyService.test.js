const CompanyService = require('../../src/services/CompanyService');
const { CompanyRepository, JobPostRepository } = require('../../src/repositories');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');
const uploadService = require('../../src/utils/uploadService');

jest.mock('../../src/repositories', () => ({
    CompanyRepository: {
        findByUserId: jest.fn(),
        update: jest.fn(),
        findById: jest.fn(),
        getDetail: jest.fn(),
        getCompanies: jest.fn()
    },
    JobPostRepository: {
        findActiveJobsByCompany: jest.fn()
    }
}));

jest.mock('../../src/utils/uploadService', () => ({
    uploadToCloudinary: jest.fn()
}));

describe('CompanyService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getMyCompany', () => {
        const mockCompany = {
            companyId: 'uuid-123',
            name: 'Tech Corp',
            userId: 'user-uuid'
        };

        test('should return company info successfully', async () => {
            CompanyRepository.findByUserId.mockResolvedValue(mockCompany);

            const result = await CompanyService.getMyCompany('user-uuid');

            expect(CompanyRepository.findByUserId).toHaveBeenCalledWith('user-uuid');
            expect(result).toEqual(mockCompany);
        });

        test('should throw error if company not found', async () => {
            CompanyRepository.findByUserId.mockResolvedValue(null);

            try {
                await CompanyService.getMyCompany('user-uuid');
            } catch (error) {
                expect(error.message).toBe(MESSAGES.COMPANY_NOT_FOUND);
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }
        });
    });

    describe('updateMyCompany', () => {
        const mockCompany = {
            companyId: 'uuid-123',
            name: 'Tech Corp',
            userId: 'user-uuid'
        };

        test('should update company successfully', async () => {
            const updateData = {
                name: 'New Name',
                phone_number: '0987654321',
                tax_code: 'should-be-ignored'
            };

            const updatedCompany = { ...mockCompany, name: 'New Name' };

            CompanyRepository.findByUserId.mockResolvedValue(mockCompany);
            CompanyRepository.update.mockResolvedValue([1]); // Sequelize usually returns [affectedCount]
            CompanyRepository.findById.mockResolvedValue(updatedCompany);

            const result = await CompanyService.updateMyCompany('user-uuid', updateData);

            expect(CompanyRepository.findByUserId).toHaveBeenCalledWith('user-uuid');
            expect(CompanyRepository.update).toHaveBeenCalledWith('uuid-123', expect.objectContaining({
                name: 'New Name',
                phoneNumber: '0987654321'
            }));
            // Ensure taxCode was removed from update payload
            expect(CompanyRepository.update).toHaveBeenCalledWith('uuid-123', expect.not.objectContaining({
                taxCode: 'should-be-ignored'
            }));
            expect(result).toEqual(updatedCompany);
        });

        test('should throw error when company not found', async () => {
            CompanyRepository.findByUserId.mockResolvedValue(null);

            try {
                await CompanyService.updateMyCompany('user-uuid', {});
            } catch (error) {
                expect(error.message).toBe(MESSAGES.COMPANY_NOT_FOUND);
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }
        });
    });

    describe('uploadLogo', () => {
        const mockCompany = { companyId: 'uuid-123' };
        const mockLogoUrl = 'https://cloudinary.com/logo.png';
        const fileBuffer = Buffer.from('test');

        test('should upload logo successfully', async () => {
            CompanyRepository.findByUserId.mockResolvedValue(mockCompany);
            uploadService.uploadToCloudinary.mockResolvedValue(mockLogoUrl);
            CompanyRepository.update.mockResolvedValue([1]);

            const result = await CompanyService.uploadLogo('user-uuid', fileBuffer);

            expect(CompanyRepository.findByUserId).toHaveBeenCalledWith('user-uuid');
            expect(uploadService.uploadToCloudinary).toHaveBeenCalledWith(fileBuffer, 'company-logos');
            expect(CompanyRepository.update).toHaveBeenCalledWith('uuid-123', { logoUrl: mockLogoUrl });
            expect(result).toBe(mockLogoUrl);
        });

        test('should throw error when company not found', async () => {
            CompanyRepository.findByUserId.mockResolvedValue(null);

            try {
                await CompanyService.uploadLogo('user-uuid', fileBuffer);
            } catch (error) {
                expect(error.message).toBe(MESSAGES.COMPANY_NOT_FOUND);
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }
        });
    });

    describe('uploadBackground', () => {
        const mockCompany = { companyId: 'uuid-123' };
        const mockUrl = 'https://cloudinary.com/bg.png';
        const fileBuffer = Buffer.from('test');

        test('should upload background successfully', async () => {
            CompanyRepository.findByUserId.mockResolvedValue(mockCompany);
            uploadService.uploadToCloudinary.mockResolvedValue(mockUrl);
            CompanyRepository.update.mockResolvedValue([1]);

            const result = await CompanyService.uploadBackground('user-uuid', fileBuffer);

            expect(CompanyRepository.findByUserId).toHaveBeenCalledWith('user-uuid');
            expect(uploadService.uploadToCloudinary).toHaveBeenCalledWith(fileBuffer, 'company-backgrounds');
            expect(CompanyRepository.update).toHaveBeenCalledWith('uuid-123', { backgroundUrl: mockUrl });
            expect(result).toBe(mockUrl);
        });

        test('should throw error when company not found', async () => {
            CompanyRepository.findByUserId.mockResolvedValue(null);

            try {
                await CompanyService.uploadBackground('user-uuid', fileBuffer);
            } catch (error) {
                expect(error.message).toBe(MESSAGES.COMPANY_NOT_FOUND);
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }
        });
    });

    describe('getCompanyDetail', () => {
        const mockCompany = { companyId: 'uuid-123', name: 'Tech Corp' };

        test('should return company detail successfully', async () => {
            CompanyRepository.getDetail.mockResolvedValue(mockCompany);

            const result = await CompanyService.getCompanyDetail('uuid-123');

            expect(CompanyRepository.getDetail).toHaveBeenCalledWith('uuid-123');
            expect(result).toEqual(mockCompany);
        });

        test('should throw error when company not found', async () => {
            CompanyRepository.getDetail.mockResolvedValue(null);

            try {
                await CompanyService.getCompanyDetail('uuid-123');
            } catch (error) {
                expect(error.message).toBe(MESSAGES.COMPANY_NOT_FOUND);
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }
        });
    });

    describe('getCompanies', () => {
        test('should return list of companies with pagination', async () => {
            const mockData = {
                count: 10,
                rows: [{ id: 1, name: 'Company A' }]
            };
            const params = { page: 1, limit: 10, keyword: 'Com' };

            CompanyRepository.getCompanies.mockResolvedValue(mockData);

            const result = await CompanyService.getCompanies(params);

            expect(CompanyRepository.getCompanies).toHaveBeenCalledWith({
                page: 1,
                limit: 10,
                keyword: 'Com'
            });
            expect(result).toEqual({
                data: mockData.rows,
                pagination: {
                    total: 10,
                    page: 1,
                    limit: 10,
                    totalPages: 1
                }
            });
        });

        test('should use default pagination params', async () => {
            const mockData = { count: 0, rows: [] };
            CompanyRepository.getCompanies.mockResolvedValue(mockData);

            await CompanyService.getCompanies({});

            expect(CompanyRepository.getCompanies).toHaveBeenCalledWith({
                page: 1,
                limit: 10,
                keyword: ''
            });
        });
    });

    describe('getCompanyJobs', () => {
        const mockCompany = { companyId: 'uuid-123' };
        const mockJobs = [{ id: 1, title: 'Job A' }];

        test('should return list of active jobs', async () => {
            CompanyRepository.findById.mockResolvedValue(mockCompany);
            JobPostRepository.findActiveJobsByCompany.mockResolvedValue(mockJobs);

            const result = await CompanyService.getCompanyJobs('uuid-123');

            expect(CompanyRepository.findById).toHaveBeenCalledWith('uuid-123');
            expect(JobPostRepository.findActiveJobsByCompany).toHaveBeenCalledWith('uuid-123', expect.any(Object));
            expect(result).toEqual(mockJobs);
        });

        test('should throw error when company not found', async () => {
            CompanyRepository.findById.mockResolvedValue(null);

            try {
                await CompanyService.getCompanyJobs('uuid-123');
            } catch (error) {
                expect(error.message).toBe(MESSAGES.COMPANY_NOT_FOUND);
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }
        });
    });
});
