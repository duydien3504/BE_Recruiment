const mockJobPostModel = {
    count: jest.fn()
};

jest.mock('../../src/models', () => ({
    JobPost: mockJobPostModel
}));

const JobPostRepository = require('../../src/repositories/JobPostRepository');

describe('JobPostRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('countByCompanyId', () => {
        test('should count non-deleted jobs of company', async () => {
            mockJobPostModel.count.mockResolvedValue(15);

            const result = await JobPostRepository.countByCompanyId('company-uuid-123');

            expect(mockJobPostModel.count).toHaveBeenCalledWith({
                where: {
                    companyId: 'company-uuid-123',
                    isDeleted: false
                }
            });
            expect(result).toBe(15);
        });
    });
});
