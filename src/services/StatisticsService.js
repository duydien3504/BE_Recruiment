const { UserRepository, JobPostRepository, ApplicationRepository, CompanyRepository } = require('../repositories');
const { Op } = require('sequelize');

class StatisticsService {
    async getDashboardStats() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Count Candidates
        const totalCandidates = await UserRepository.countWithRole('Candidate', {
            isDeleted: false
        });

        // Count Employers
        const totalEmployers = await CompanyRepository.count({
            isDeleted: false
        });

        // Count Job Posts
        const totalJobPosts = await JobPostRepository.count({
            isDeleted: false
        });

        // Count Applications
        const totalApplications = await ApplicationRepository.count({});

        // New Users (Last 30 days)
        // Note: Filters might need explicit include if filtering by Role for new Users, 
        // but broadly "new_users" implies all new registrations.
        const newUsers = await UserRepository.count({
            created_at: { [Op.gte]: thirtyDaysAgo },
            isDeleted: false
        });

        // New Jobs
        const newJobs = await JobPostRepository.count({
            created_at: { [Op.gte]: thirtyDaysAgo },
            isDeleted: false
        });

        return {
            total_candidates: totalCandidates,
            total_employers: totalEmployers,
            total_job_posts: totalJobPosts,
            total_applications: totalApplications,
            new_users: newUsers,
            new_jobs: newJobs
        };
    }

    async getGrowthStats() {
        const stats = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const startOfDay = new Date(date.getTime());
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date.getTime());
            endOfDay.setHours(23, 59, 59, 999);

            const usersCount = await UserRepository.count({
                created_at: { [Op.between]: [startOfDay, endOfDay] },
                isDeleted: false
            });

            const jobsCount = await JobPostRepository.count({
                created_at: { [Op.between]: [startOfDay, endOfDay] },
                isDeleted: false
            });

            stats.push({
                name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                users: usersCount,
                jobs: jobsCount
            });
        }
        return stats;
    }
}

module.exports = new StatisticsService();
