const TransactionService = require('../../src/services/TransactionService');
const { TransactionRepository, CompanyRepository } = require('../../src/repositories');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/repositories');

describe('TransactionService', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('getHistory', () => {
        it('should return transaction history for valid company', async () => {
            const userId = 'u1';
            const company = { companyId: 'c1' };
            const history = [{ transactionId: 1, amount: 100 }];

            CompanyRepository.findByUserId.mockResolvedValue(company);
            TransactionRepository.findByCompany.mockResolvedValue(history);

            const result = await TransactionService.getHistory(userId, {});

            expect(CompanyRepository.findByUserId).toHaveBeenCalledWith(userId);
            expect(TransactionRepository.findByCompany).toHaveBeenCalledWith('c1', expect.objectContaining({ limit: 20 }));
            expect(result).toEqual(history);
        });

        it('should throw BAD_REQUEST if user has no company', async () => {
            CompanyRepository.findByUserId.mockResolvedValue(null);

            await expect(TransactionService.getHistory('u1', {})).rejects.toThrow('Bạn không có công ty nào.');
        });
    });
});
