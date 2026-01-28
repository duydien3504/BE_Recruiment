const InterviewService = require('../../src/services/InterviewService');
const { InterviewRepository, ApplicationRepository, CompanyRepository } = require('../../src/repositories');
const MESSAGES = require('../../src/constant/messages');

// Mock toàn bộ thư mục repositories
jest.mock('../../src/repositories');

// Mock cấu hình database để tránh lỗi kết nối thật hoặc lỗi sequelize.define
jest.mock('../../src/config/database', () => {
    return {
        sequelize: {
            transaction: jest.fn(),
            define: jest.fn().mockReturnValue({
                belongsTo: jest.fn(),
                hasMany: jest.fn(),
                belongsToMany: jest.fn(),
                hasOne: jest.fn()
            })
        }
    };
});

describe('InterviewService.createInterview', () => {
    let mockTransaction;
    let sequelize;

    beforeEach(() => {
        jest.clearAllMocks();
        // Lấy mock instance của sequelize
        sequelize = require('../../src/config/database').sequelize;
        mockTransaction = {
            commit: jest.fn(),
            rollback: jest.fn()
        };
        sequelize.transaction.mockResolvedValue(mockTransaction);
    });

    const userId = 'user-123';
    const data = {
        applicationId: 1,
        interview_time: '2024-02-01T10:00:00Z',
        type: 'Online',
        meeting_link: 'http://meet',
        note: 'Welcome'
    };

    it('should create interview and update application status successfully', async () => {
        const mockApp = { applicationId: 1, jobPost: { companyId: 100 } };
        ApplicationRepository.findDetailById.mockResolvedValue(mockApp);
        CompanyRepository.findByUserId.mockResolvedValue({ companyId: 100 });
        InterviewRepository.create.mockResolvedValue({ id: 10, ...data });

        const result = await InterviewService.createInterview(userId, data);

        expect(sequelize.transaction).toHaveBeenCalled();
        expect(ApplicationRepository.findDetailById).toHaveBeenCalledWith(1);
        expect(CompanyRepository.findByUserId).toHaveBeenCalledWith(userId);
        expect(InterviewRepository.create).toHaveBeenCalledWith(expect.any(Object), { transaction: mockTransaction });
        expect(ApplicationRepository.updateStatus).toHaveBeenCalledWith(1, 'Interview', 'Welcome', { transaction: mockTransaction });
        expect(mockTransaction.commit).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it('should throw NOT_FOUND if application not found', async () => {
        ApplicationRepository.findDetailById.mockResolvedValue(null);

        await expect(InterviewService.createInterview(userId, data)).rejects.toThrow(MESSAGES.APPLICATION_NOT_FOUND);
        expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should throw FORBIDDEN if user is not owner', async () => {
        const mockApp = { applicationId: 1, jobPost: { companyId: 100 } };
        ApplicationRepository.findDetailById.mockResolvedValue(mockApp);
        CompanyRepository.findByUserId.mockResolvedValue({ companyId: 200 });

        await expect(InterviewService.createInterview(userId, data)).rejects.toThrow(MESSAGES.FORBIDDEN);
        expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should rollback if create fails', async () => {
        const mockApp = { applicationId: 1, jobPost: { companyId: 100 } };
        ApplicationRepository.findDetailById.mockResolvedValue(mockApp);
        CompanyRepository.findByUserId.mockResolvedValue({ companyId: 100 });
        InterviewRepository.create.mockRejectedValue(new Error('DB Error'));

        await expect(InterviewService.createInterview(userId, data)).rejects.toThrow('DB Error');
        expect(mockTransaction.rollback).toHaveBeenCalled();
    });
});
