const JobService = require('../../src/services/JobService');
const { JobPostRepository } = require('../../src/repositories');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/repositories', () => ({
    JobPostRepository: {
        search: jest.fn(),
        getDetail: jest.fn(),
        create: jest.fn()
    },
    CompanyRepository: {
        findByUserId: jest.fn()
    },
    TransactionRepository: {
        create: jest.fn()
    }
}));

jest.mock('../../src/utils/vnpayHelper', () => ({
    createPaymentUrl: jest.fn()
}));

describe('JobService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getJobs', () => {
        test('should return list of jobs with pagination', async () => {
            const mockData = {
                count: 10,
                rows: [{ id: 1, title: 'Java Developer' }]
            };
            const query = { page: 1, limit: 10, keyword: 'Java', category_id: 1, location_id: 2 };

            JobPostRepository.search.mockResolvedValue(mockData);

            const result = await JobService.getJobs(query);

            expect(JobPostRepository.search).toHaveBeenCalledWith({
                keyword: 'Java',
                categoryId: 1,
                locationId: 2
            }, {
                limit: 10,
                offset: 0
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

        test('should use default params', async () => {
            JobPostRepository.search.mockResolvedValue({ count: 0, rows: [] });

            await JobService.getJobs({});

            expect(JobPostRepository.search).toHaveBeenCalledWith({
                keyword: undefined,
                categoryId: undefined,
                locationId: undefined
            }, {
                limit: 10,
                offset: 0
            });
        });
    });

    describe('getJobDetail', () => {
        const mockJob = {
            id: 1,
            title: 'Java Dev',
            salaryMin: 1000,
            salaryMax: 2000,
            toJSON: jest.fn().mockReturnValue({
                id: 1,
                title: 'Java Dev',
                salaryMin: 1000,
                salaryMax: 2000
            })
        };

        test('should return full salary for authenticated user', async () => {
            JobPostRepository.getDetail.mockResolvedValue(mockJob);

            const result = await JobService.getJobDetail(1, 'user-uuid');

            expect(result.salaryMin).toBe(1000);
            expect(result.salaryMax).toBe(2000);
            expect(result.isHiddenSalary).toBeFalsy();
        });

        test('should mask salary for guest', async () => {
            JobPostRepository.getDetail.mockResolvedValue(mockJob);

            const result = await JobService.getJobDetail(1, null);

            expect(result.salaryMin).toBeNull();
            expect(result.salaryMax).toBeNull();
            expect(result.isHiddenSalary).toBeTruthy();
            expect(result.salaryDisplay).toBe('Đăng nhập để xem');
        });

        test('should throw error when job not found', async () => {
            JobPostRepository.getDetail.mockResolvedValue(null);

            try {
                await JobService.getJobDetail(1, 'user-uuid');
            } catch (error) {
                expect(error.message).toBe(MESSAGES.JOB_NOT_FOUND);
                expect(error.status).toBe(HTTP_STATUS.NOT_FOUND);
            }
        });
    });

    describe('createJob', () => {
        const { CompanyRepository, TransactionRepository } = require('../../src/repositories');
        const vnpayHelper = require('../../src/utils/vnpayHelper');

        test('should create job with payment URL', async () => {
            const mockCompany = { companyId: 'company-uuid' };
            const jobData = {
                title: 'Java Dev',
                description: 'Test',
                category_id: 1,
                location_id: 2
            };
            const mockJob = { jobPostId: 1, status: 'Draft' };
            const mockTransaction = { transactionId: 100 };
            const mockPaymentUrl = 'https://vnpay.vn/payment';

            CompanyRepository.findByUserId.mockResolvedValue(mockCompany);
            JobPostRepository.create.mockResolvedValue(mockJob);
            TransactionRepository.create.mockResolvedValue(mockTransaction);
            vnpayHelper.createPaymentUrl.mockReturnValue(mockPaymentUrl);

            const result = await JobService.createJob('user-uuid', jobData, '127.0.0.1');

            expect(CompanyRepository.findByUserId).toHaveBeenCalledWith('user-uuid');
            expect(JobPostRepository.create).toHaveBeenCalled();
            expect(TransactionRepository.create).toHaveBeenCalled();
            expect(vnpayHelper.createPaymentUrl).toHaveBeenCalled();
            expect(result.job.status).toBe('Draft');
            expect(result.paymentUrl).toBe(mockPaymentUrl);
        });
    });
});
