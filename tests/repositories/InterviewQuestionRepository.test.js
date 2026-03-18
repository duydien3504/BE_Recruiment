const InterviewQuestionRepository = require('../../src/repositories/InterviewQuestionRepository');
const { InterviewQuestion } = require('../../src/models');

jest.mock('../../src/models', () => ({
    InterviewQuestion: {
        destroy: jest.fn(),
        bulkCreate: jest.fn(),
        findAll: jest.fn()
    }
}));

describe('InterviewQuestionRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('deleteByApplicationId', () => {
        it('should call destroy with correct where clause', async () => {
            InterviewQuestion.destroy.mockResolvedValue(5);
            const transaction = {};

            const result = await InterviewQuestionRepository.deleteByApplicationId(1, transaction);
            
            expect(InterviewQuestion.destroy).toHaveBeenCalledWith({
                where: { applicationId: 1 },
                transaction
            });
            expect(result).toBe(5);
        });
    });

    describe('bulkCreateQuestions', () => {
        it('should call bulkCreate with correct payload', async () => {
            const mockQuestions = [{ questionContent: 'Q1' }];
            InterviewQuestion.bulkCreate.mockResolvedValue(mockQuestions);
            const transaction = {};

            const result = await InterviewQuestionRepository.bulkCreateQuestions(mockQuestions, transaction);

            expect(InterviewQuestion.bulkCreate).toHaveBeenCalledWith(mockQuestions, { transaction });
            expect(result).toEqual(mockQuestions);
        });
    });

    describe('findByApplicationId', () => {
        it('should call findAll with correct ordering', async () => {
            const mockData = [{ id: 1 }];
            InterviewQuestion.findAll.mockResolvedValue(mockData);

            const result = await InterviewQuestionRepository.findByApplicationId(1);

            expect(InterviewQuestion.findAll).toHaveBeenCalledWith(
                { where: { applicationId: 1 }, order: [['created_at', 'ASC']] }
            );
            expect(result).toEqual(mockData);
        });
    });
});
