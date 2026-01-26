const { authenticateToken } = require('../../src/middleware/authMiddleware');
const jwtHelper = require('../../src/utils/jwtHelper');
const { UserRepository } = require('../../src/repositories');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/utils/jwtHelper');
jest.mock('../../src/repositories', () => ({
    UserRepository: {
        findById: jest.fn()
    }
}));

describe('authMiddleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {};
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('authenticateToken', () => {
        const mockUser = {
            userId: 'uuid-123',
            email: 'test@example.com',
            role: { roleName: 'seeker' },
            fullName: 'Test User'
        };

        test('should authenticate valid token and attach user to request', async () => {
            req.headers['authorization'] = 'Bearer valid-token';
            jwtHelper.verifyAccessToken.mockReturnValue({ userId: 'uuid-123' });
            UserRepository.findById.mockResolvedValue(mockUser);

            await authenticateToken(req, res, next);

            expect(jwtHelper.verifyAccessToken).toHaveBeenCalledWith('valid-token');
            expect(UserRepository.findById).toHaveBeenCalledWith('uuid-123', expect.any(Object));
            expect(req.user).toEqual({
                userId: 'uuid-123',
                email: 'test@example.com',
                role: 'seeker',
                fullName: 'Test User'
            });
            expect(next).toHaveBeenCalledWith();
        });

        test('should fail when authorization header is missing', async () => {
            await authenticateToken(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: MESSAGES.TOKEN_REQUIRED,
                    status: HTTP_STATUS.UNAUTHORIZED
                })
            );
        });

        test('should fail when token is empty after Bearer', async () => {
            req.headers['authorization'] = 'Bearer ';

            await authenticateToken(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: MESSAGES.TOKEN_REQUIRED,
                    status: HTTP_STATUS.UNAUTHORIZED
                })
            );
        });

        test('should fail when token is invalid', async () => {
            req.headers['authorization'] = 'Bearer invalid-token';
            jwtHelper.verifyAccessToken.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await authenticateToken(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: MESSAGES.INVALID_TOKEN,
                    status: HTTP_STATUS.UNAUTHORIZED
                })
            );
        });

        test('should fail when user not found in database', async () => {
            req.headers['authorization'] = 'Bearer valid-token';
            jwtHelper.verifyAccessToken.mockReturnValue({ userId: 'uuid-123' });
            UserRepository.findById.mockResolvedValue(null);

            await authenticateToken(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: MESSAGES.USER_NOT_FOUND,
                    status: HTTP_STATUS.UNAUTHORIZED
                })
            );
        });

        test('should accept token without Bearer prefix', async () => {
            req.headers['authorization'] = 'valid-token';
            jwtHelper.verifyAccessToken.mockReturnValue({ userId: 'uuid-123' });
            UserRepository.findById.mockResolvedValue(mockUser);

            await authenticateToken(req, res, next);

            expect(jwtHelper.verifyAccessToken).toHaveBeenCalledWith('valid-token');
            expect(next).toHaveBeenCalledWith();
        });
    });
});
