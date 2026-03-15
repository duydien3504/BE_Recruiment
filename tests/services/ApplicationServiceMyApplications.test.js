const ApplicationService = require('../../src/services/ApplicationService');
const { ApplicationRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');
const { PAGINATION_DEFAULTS } = require('../../src/constant/applicationConstants');

jest.mock('../../src/repositories');

describe('ApplicationService.getMyApplications', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userId = 'user-uuid-123';

    // ─── Helper để tạo mock application row ─────────────────────────────────────
    const buildMockRow = (overrides = {}) => ({
        applicationId: 1,
        jobPostId: 5,
        coverLetter: 'My cover letter',
        status: 'Pending',
        createdAt: '2026-03-15T11:00:00.000Z',
        jobPost: {
            title: 'Backend Developer',
            company: { name: 'Tech Corp' }
        },
        ...overrides
    });

    // ─── Happy Path: không filter status ─────────────────────────────────────────
    it('should return paginated applications without status filter', async () => {
        const mockRows = [buildMockRow()];
        ApplicationRepository.findAndCountByUserId.mockResolvedValue({ count: 1, rows: mockRows });

        const result = await ApplicationService.getMyApplications(userId, {
            page: 1,
            limit: 10,
            status: undefined
        });

        expect(ApplicationRepository.findAndCountByUserId).toHaveBeenCalledWith(userId, {
            status: undefined,
            limit: 10,
            offset: 0
        });

        expect(result.applications).toHaveLength(1);
        expect(result.applications[0]).toEqual({
            applicationId: 1,
            jobPostId: 5,
            jobTitle: 'Backend Developer',
            companyName: 'Tech Corp',
            coverLetter: 'My cover letter',
            status: 'Pending',
            appliedAt: '2026-03-15T11:00:00.000Z'
        });
        expect(result.pagination).toEqual({
            currentPage: 1,
            totalPages: 1,
            totalItems: 1,
            limit: 10
        });
    });

    // ─── Happy Path: filter status = 'Accepted' ──────────────────────────────────
    it('should return filtered applications when status is provided', async () => {
        const mockRows = [buildMockRow({ status: 'Accepted' })];
        ApplicationRepository.findAndCountByUserId.mockResolvedValue({ count: 1, rows: mockRows });

        const result = await ApplicationService.getMyApplications(userId, {
            page: 1,
            limit: 10,
            status: 'Accepted'
        });

        expect(ApplicationRepository.findAndCountByUserId).toHaveBeenCalledWith(userId, {
            status: 'Accepted',
            limit: 10,
            offset: 0
        });
        expect(result.applications[0].status).toBe('Accepted');
    });

    // ─── Happy Path: trang 2, pagination offset đúng ────────────────────────────
    it('should calculate correct offset for page 2', async () => {
        ApplicationRepository.findAndCountByUserId.mockResolvedValue({ count: 25, rows: [] });

        const result = await ApplicationService.getMyApplications(userId, {
            page: 2,
            limit: 10,
            status: undefined
        });

        expect(ApplicationRepository.findAndCountByUserId).toHaveBeenCalledWith(userId, {
            status: undefined,
            limit: 10,
            offset: 10   // (2 - 1) * 10
        });

        expect(result.pagination).toEqual({
            currentPage: 2,
            totalPages: 3,   // ceil(25/10)
            totalItems: 25,
            limit: 10
        });
    });

    // ─── Happy Path: totalPages = ceil (không chia hết) ──────────────────────────
    it('should ceil totalPages correctly when count is not divisible by limit', async () => {
        ApplicationRepository.findAndCountByUserId.mockResolvedValue({ count: 11, rows: [] });

        const result = await ApplicationService.getMyApplications(userId, {
            page: 1,
            limit: 5,
            status: undefined
        });

        expect(result.pagination.totalPages).toBe(3); // ceil(11/5) = 3
        expect(result.pagination.totalItems).toBe(11);
    });

    // ─── Edge: count = 0, totalPages = 0 ─────────────────────────────────────────
    it('should return empty list and totalPages=0 when no applications exist', async () => {
        ApplicationRepository.findAndCountByUserId.mockResolvedValue({ count: 0, rows: [] });

        const result = await ApplicationService.getMyApplications(userId, {
            page: 1,
            limit: 10,
            status: undefined
        });

        expect(result.applications).toHaveLength(0);
        expect(result.pagination.totalPages).toBe(0);
        expect(result.pagination.totalItems).toBe(0);
    });

    // ─── Edge: jobPost null (tránh crash nếu job bị xoá) ────────────────────────
    it('should safely return null jobTitle/companyName when jobPost is null', async () => {
        const mockRows = [buildMockRow({ jobPost: null })];
        ApplicationRepository.findAndCountByUserId.mockResolvedValue({ count: 1, rows: mockRows });

        const result = await ApplicationService.getMyApplications(userId, {
            page: 1,
            limit: 10,
            status: undefined
        });

        expect(result.applications[0].jobTitle).toBeNull();
        expect(result.applications[0].companyName).toBeNull();
    });
});
