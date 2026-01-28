const StatisticsService = require('../../src/services/StatisticsService');
const { UserRepository, JobPostRepository, ApplicationRepository, CompanyRepository } = require('../../src/repositories');
const { Op } = require('sequelize');

jest.mock('../../src/repositories', () => ({
    UserRepository: {
        count: jest.fn(),
        countWithRole: jest.fn()
    },
    JobPostRepository: {
        count: jest.fn()
    },
    ApplicationRepository: {
        count: jest.fn()
    },
    CompanyRepository: {
        count: jest.fn()
    }
}));

describe('StatisticsService', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('getDashboardStats', () => {
        it('should return dashboard statistics', async () => {
            UserRepository.countWithRole.mockResolvedValueOnce(50); // Candidates
            CompanyRepository.count.mockResolvedValueOnce(10); // Employers
            JobPostRepository.count.mockResolvedValueOnce(20); // Jobs
            ApplicationRepository.count.mockResolvedValueOnce(100); // Applications
            UserRepository.count.mockResolvedValueOnce(5); // New Users
            JobPostRepository.count.mockResolvedValueOnce(2); // New Jobs

            const result = await StatisticsService.getDashboardStats();

            expect(UserRepository.countWithRole).toHaveBeenCalledTimes(1);
            expect(UserRepository.count).toHaveBeenCalledTimes(1);
            expect(CompanyRepository.count).toHaveBeenCalledTimes(1);
            expect(JobPostRepository.count).toHaveBeenCalledTimes(2);
            expect(ApplicationRepository.count).toHaveBeenCalledTimes(1);

            expect(result).toEqual({
                total_candidates: 50,
                total_employers: 10,
                total_job_posts: 20,
                total_applications: 100,
                new_users: 5,
                new_jobs: 2
            });
        });
    });
});
