const JobService = require('../../src/services/JobService');
const { JobPostRepository, CompanyRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

jest.mock('../../src/repositories');

describe('JobService.updateJobStatus', () => {
    let mockJob;
    let mockCompany;

    beforeEach(() => {
        jest.clearAllMocks();

        mockJob = {
            jobPostId: 1,
            companyId: 1,
            status: 'Closed',
            expiredAt: new Date(Date.now() + 86400000) // Tomorrow
        };

        mockCompany = {
            companyId: 1,
            userId: 1
        };
    });

    it('should update status successfully when valid', async () => {
        JobPostRepository.findById.mockResolvedValue(mockJob);
        CompanyRepository.findByUserId.mockResolvedValue(mockCompany);
        JobPostRepository.updateStatus.mockResolvedValue({ ...mockJob, status: 'Active' });

        const result = await JobService.updateJobStatus(1, 1, 'Active');

        expect(JobPostRepository.findById).toHaveBeenCalledWith(1);
        expect(CompanyRepository.findByUserId).toHaveBeenCalledWith(1);
        expect(JobPostRepository.updateStatus).toHaveBeenCalledWith(1, 'Active');
        expect(result.status).toBe('Active');
    });

    it('should throw error if job expired when setting to Active', async () => {
        const expiredJob = { ...mockJob, status: 'Closed', expiredAt: new Date(Date.now() - 86400000) }; // Yesterday
        JobPostRepository.findById.mockResolvedValue(expiredJob);
        CompanyRepository.findByUserId.mockResolvedValue(mockCompany);

        await expect(JobService.updateJobStatus(1, 1, 'Active')).rejects.toThrow('Tin tuyển dụng đã hết hạn. Vui lòng gia hạn thêm.');
    });

    it('should throw FORBIDDEN error if user is not owner', async () => {
        JobPostRepository.findById.mockResolvedValue(mockJob);
        CompanyRepository.findByUserId.mockResolvedValue({ companyId: 2, userId: 1 });

        await expect(JobService.updateJobStatus(1, 1, 'Active')).rejects.toThrow('Bạn không có quyền chỉnh sửa tin này.');
    });

    it('should throw BAD_REQUEST if status transition is invalid (Draft -> Active)', async () => {
        const draftJob = { ...mockJob, status: 'Draft' };
        JobPostRepository.findById.mockResolvedValue(draftJob);
        CompanyRepository.findByUserId.mockResolvedValue(mockCompany);

        await expect(JobService.updateJobStatus(1, 1, 'Active')).rejects.toThrow('Không thể chuyển trạng thái từ Draft sang Active.');
    });
});
