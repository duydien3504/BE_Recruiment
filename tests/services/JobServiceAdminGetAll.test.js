const JobService = require('../../src/services/JobService');
const { JobPostRepository } = require('../../src/repositories');

jest.mock('../../src/repositories');

describe('JobService.getAllJobs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call getAllJobs with correct filters and options', async () => {
        const query = { status: 'Active', companyId: 1, keyword: 'Dev', limit: 10, page: 2 };
        const mockResult = { count: 1, rows: [] };
        JobPostRepository.getAllJobs.mockResolvedValue(mockResult);

        const result = await JobService.getAllJobs(query);

        expect(JobPostRepository.getAllJobs).toHaveBeenCalledWith(
            { status: 'Active', companyId: 1, keyword: 'Dev' },
            { limit: 10, offset: 10 }
        );
        expect(result).toEqual(mockResult);
    });

    it('should call getAllJobs with empty filters if query is empty', async () => {
        const query = {};
        const mockResult = { count: 0, rows: [] };
        JobPostRepository.getAllJobs.mockResolvedValue(mockResult);

        await JobService.getAllJobs(query);

        expect(JobPostRepository.getAllJobs).toHaveBeenCalledWith(
            { status: undefined, companyId: undefined, keyword: undefined },
            {}
        );
    });
});
