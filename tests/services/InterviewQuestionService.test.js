const { sequelize } = require('../../src/config/database');
const InterviewQuestionRepository = require('../../src/repositories/InterviewQuestionRepository');
const ApplicationRepository = require('../../src/repositories/ApplicationRepository');
const CompanyRepository = require('../../src/repositories/CompanyRepository');
const AIService = require('../../src/services/AIService');
const pdfExtractor = require('../../src/utils/pdfExtractor');
const InterviewQuestionService = require('../../src/services/InterviewQuestionService');

jest.mock('../../src/config/database', () => ({
    sequelize: {
        transaction: jest.fn(),
        define: jest.fn(() => ({
            hasMany: jest.fn(),
            belongsTo: jest.fn(),
            hasOne: jest.fn(),
            belongsToMany: jest.fn()
        }))
    }
}));
jest.mock('../../src/repositories/InterviewQuestionRepository');
jest.mock('../../src/repositories/ApplicationRepository');
jest.mock('../../src/repositories/CompanyRepository');
jest.mock('../../src/services/AIService');
jest.mock('../../src/utils/pdfExtractor');

describe('InterviewQuestionService', () => {
    let mockTransaction;

    beforeEach(() => {
        jest.clearAllMocks();
        mockTransaction = {
            commit: jest.fn(),
            rollback: jest.fn()
        };
        sequelize.transaction.mockResolvedValue(mockTransaction);
    });

    describe('generateInterviewQuestions', () => {
        const mockEmployerId = 'emp-123';
        const mockApplicationId = 1;
        const mockCompany = { companyId: 99 };
        const mockApplication = {
            jobPost: { companyId: 99, title: 'Dev', description: 'Desc', requirements: 'Reqs' },
            resume: { fileUrl: 'http://cv.pdf' }
        };

        it('should throw 404 if application not found', async () => {
            ApplicationRepository.findDetailById.mockResolvedValue(null);
            
            await expect(InterviewQuestionService.generateInterviewQuestions(mockApplicationId, mockEmployerId, false))
                .rejects.toThrow('Application ID not found');
        });

        it('should throw 403 if company mismatch', async () => {
            ApplicationRepository.findDetailById.mockResolvedValue(mockApplication);
            CompanyRepository.findOne.mockResolvedValue({ companyId: 100 }); // Different company
            
            await expect(InterviewQuestionService.generateInterviewQuestions(mockApplicationId, mockEmployerId, false))
                .rejects.toThrow('You do not have permission to access this application');
        });

        it('should return existing questions if not force regenerate', async () => {
            ApplicationRepository.findDetailById.mockResolvedValue(mockApplication);
            CompanyRepository.findOne.mockResolvedValue(mockCompany);
            InterviewQuestionRepository.findByApplicationId.mockResolvedValue([{ id: 1 }]);
            
            const result = await InterviewQuestionService.generateInterviewQuestions(mockApplicationId, mockEmployerId, false);
            
            expect(result.length).toBe(1);
            expect(pdfExtractor.extractTextFromPdfUrl).not.toHaveBeenCalled();
        });

        it('should throw 400 if resume missing', async () => {
            ApplicationRepository.findDetailById.mockResolvedValue({
                jobPost: { companyId: 99 },
                resume: null
            });
            CompanyRepository.findOne.mockResolvedValue(mockCompany);
            InterviewQuestionRepository.findByApplicationId.mockResolvedValue([]);
            
            await expect(InterviewQuestionService.generateInterviewQuestions(mockApplicationId, mockEmployerId, false))
                .rejects.toThrow('Candidate CV is missing or invalid');
        });

        it('should throw 400 if resume extraction fails', async () => {
            ApplicationRepository.findDetailById.mockResolvedValue(mockApplication);
            CompanyRepository.findOne.mockResolvedValue(mockCompany);
            InterviewQuestionRepository.findByApplicationId.mockResolvedValue([]);
            pdfExtractor.extractTextFromPdfUrl.mockRejectedValue(new Error('Extract error'));
            
            await expect(InterviewQuestionService.generateInterviewQuestions(mockApplicationId, mockEmployerId, false))
                .rejects.toThrow('Failed to read Candidate CV');
        });

        it('should throw 400 if resume extraction is empty', async () => {
            ApplicationRepository.findDetailById.mockResolvedValue(mockApplication);
            CompanyRepository.findOne.mockResolvedValue(mockCompany);
            InterviewQuestionRepository.findByApplicationId.mockResolvedValue([]);
            pdfExtractor.extractTextFromPdfUrl.mockResolvedValue('   ');
            
            await expect(InterviewQuestionService.generateInterviewQuestions(mockApplicationId, mockEmployerId, false))
                .rejects.toThrow('Candidate CV is empty after extraction');
        });

        it('should successfully generate and save new questions', async () => {
            ApplicationRepository.findDetailById.mockResolvedValue(mockApplication);
            CompanyRepository.findOne.mockResolvedValue(mockCompany);
            InterviewQuestionRepository.findByApplicationId.mockResolvedValueOnce([{ id: 1 }]) // old questions
                                                          .mockResolvedValueOnce([{ id: 2 }]); // new questions
            pdfExtractor.extractTextFromPdfUrl.mockResolvedValue('Valid CV Text');
            
            AIService.generateInterviewQuestions.mockResolvedValue([
                { content: 'Q1', expected_answer: 'A1' }
            ]);

            const result = await InterviewQuestionService.generateInterviewQuestions(mockApplicationId, mockEmployerId, true);
            
            expect(InterviewQuestionRepository.deleteByApplicationId).toHaveBeenCalledWith(1, mockTransaction);
            expect(InterviewQuestionRepository.bulkCreateQuestions).toHaveBeenCalledWith([
                { applicationId: 1, questionContent: 'Q1', expectedAnswer: 'A1' }
            ], mockTransaction);
            expect(mockTransaction.commit).toHaveBeenCalled();
            expect(result).toEqual([{ id: 2 }]);
        });

        it('should rollback transaction on DB error', async () => {
            ApplicationRepository.findDetailById.mockResolvedValue(mockApplication);
            CompanyRepository.findOne.mockResolvedValue(mockCompany);
            InterviewQuestionRepository.findByApplicationId.mockResolvedValue([]);
            pdfExtractor.extractTextFromPdfUrl.mockResolvedValue('Valid CV Text');
            AIService.generateInterviewQuestions.mockResolvedValue([
                { content: 'Q1', expected_answer: 'A1' }
            ]);
            
            InterviewQuestionRepository.bulkCreateQuestions.mockRejectedValue(new Error('DB Failed'));

            await expect(InterviewQuestionService.generateInterviewQuestions(mockApplicationId, mockEmployerId, false))
                .rejects.toThrow('Database transaction failed: DB Failed');
                
            expect(mockTransaction.rollback).toHaveBeenCalled();
        });
    });
});
