const CvBuilderRepository = require('../../src/repositories/CvBuilderRepository');
const { CvBuilder } = require('../../src/models');

jest.mock('../../src/models');

describe('CvBuilderRepository', () => {
    let mockCvBuilder;

    beforeEach(() => {
        jest.clearAllMocks();

        mockCvBuilder = {
            id: 'cv-uuid-001',
            userId: 'user-uuid-001',
            templateId: 'default_template',
            themeConfig: { primaryColor: '#000000', layoutMode: '1-column', fontFamily: 'Inter' },
            cvData: {},
            atsScore: 0,
            created_at: '2026-01-01T00:00:00.000Z',
            updated_at: '2026-01-01T00:00:00.000Z',
            update: jest.fn(),
            destroy: jest.fn()
        };
    });

    // ─── findByUserId ─────────────────────────────────────────────────────────

    describe('findByUserId', () => {
        test('should return CvBuilder record when userId exists', async () => {
            CvBuilder.findOne = jest.fn().mockResolvedValue(mockCvBuilder);

            const result = await CvBuilderRepository.findByUserId('user-uuid-001');

            expect(CvBuilder.findOne).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { userId: 'user-uuid-001' }
                })
            );
            expect(result).toEqual(mockCvBuilder);
        });

        test('should return null when no CvBuilder found for userId', async () => {
            CvBuilder.findOne = jest.fn().mockResolvedValue(null);

            const result = await CvBuilderRepository.findByUserId('non-existent-user');

            expect(CvBuilder.findOne).toHaveBeenCalled();
            expect(result).toBeNull();
        });

        test('should propagate DB error when findOne throws', async () => {
            const dbError = new Error('DB connection lost');
            CvBuilder.findOne = jest.fn().mockRejectedValue(dbError);

            await expect(CvBuilderRepository.findByUserId('user-uuid-001')).rejects.toThrow('DB connection lost');
        });
    });

    // ─── createDefault ─────────────────────────────────────────────────────────

    describe('createDefault', () => {
        test('should create a new CvBuilder with default values for userId', async () => {
            CvBuilder.create = jest.fn().mockResolvedValue(mockCvBuilder);

            const result = await CvBuilderRepository.createDefault('user-uuid-001');

            expect(CvBuilder.create).toHaveBeenCalledWith({ userId: 'user-uuid-001' });
            expect(result).toEqual(mockCvBuilder);
        });

        test('should propagate DB error when create throws', async () => {
            const dbError = new Error('Unique constraint violation');
            CvBuilder.create = jest.fn().mockRejectedValue(dbError);

            await expect(CvBuilderRepository.createDefault('user-uuid-001')).rejects.toThrow('Unique constraint violation');
        });
    });

    // ─── updateDraft ──────────────────────────────────────────────────────────

    describe('updateDraft', () => {
        test('should update CvBuilder record when id exists', async () => {
            const payload = { templateId: 'modern_01', cvData: { about: 'Hello' } };
            const updatedRecord = { ...mockCvBuilder, ...payload };
            CvBuilder.findByPk = jest.fn().mockResolvedValue(mockCvBuilder);
            mockCvBuilder.update.mockResolvedValue(updatedRecord);

            const result = await CvBuilderRepository.updateDraft('cv-uuid-001', payload);

            expect(CvBuilder.findByPk).toHaveBeenCalledWith('cv-uuid-001', {});
            expect(mockCvBuilder.update).toHaveBeenCalledWith(payload);
            expect(result).toEqual(updatedRecord);
        });

        test('should return null when id not found', async () => {
            CvBuilder.findByPk = jest.fn().mockResolvedValue(null);

            const result = await CvBuilderRepository.updateDraft('non-existent-id', { templateId: 'x' });

            expect(result).toBeNull();
        });
    });
});
