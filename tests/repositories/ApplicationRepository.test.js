const mockApplicationModel = {
    count: jest.fn()
};

const mockJobPostModel = {};

jest.mock('../../src/models', () => ({
    Application: mockApplicationModel,
    JobPost: mockJobPostModel
}));

const ApplicationRepository = require('../../src/repositories/ApplicationRepository');

describe('ApplicationRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('countByCompanyId', () => {
        test('should count applications by company through jobPost include', async () => {
            mockApplicationModel.count.mockResolvedValue(240);

            const result = await ApplicationRepository.countByCompanyId('company-uuid-123');

            expect(mockApplicationModel.count).toHaveBeenCalledWith({
                include: [
                    {
                        model: mockJobPostModel,
                        as: 'jobPost',
                        required: true,
                        attributes: [],
                        where: { companyId: 'company-uuid-123' }
                    }
                ]
            });
            expect(result).toBe(240);
        });
    });

    describe('countByCompanyIdAndStatus', () => {
        test('should count applications by company and status', async () => {
            mockApplicationModel.count.mockResolvedValue(12);

            const result = await ApplicationRepository.countByCompanyIdAndStatus('company-uuid-123', 'Accepted');

            expect(mockApplicationModel.count).toHaveBeenCalledWith({
                where: { status: 'Accepted' },
                include: [
                    {
                        model: mockJobPostModel,
                        as: 'jobPost',
                        required: true,
                        attributes: [],
                        where: { companyId: 'company-uuid-123' }
                    }
                ]
            });
            expect(result).toBe(12);
        });
    });
});
