const AuthController = require('../../src/controllers/AuthController');
const AuthService = require('../../src/services/AuthService');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

// Mock AuthService
jest.mock('../../src/services/AuthService');

describe('AuthController', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('register', () => {
        test('should return 201 and success message on successful registration', async () => {
            const mockResult = {
                userId: 'uuid-123',
                email: 'test@example.com'
            };

            req.body = {
                email: 'test@example.com',
                password: 'Password123',
                full_name: 'Nguyen Van A',
                role_id: 3
            };

            AuthService.register.mockResolvedValue(mockResult);

            await AuthController.register(req, res, next);

            expect(AuthService.register).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.REGISTER_SUCCESS,
                data: mockResult
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should call next with error when service throws error', async () => {
            const mockError = new Error('Email already exists');
            mockError.status = HTTP_STATUS.CONFLICT;

            req.body = {
                email: 'test@example.com',
                password: 'Password123',
                full_name: 'Nguyen Van A',
                role_id: 3
            };

            AuthService.register.mockRejectedValue(mockError);

            await AuthController.register(req, res, next);

            expect(AuthService.register).toHaveBeenCalledWith(req.body);
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        test('should pass error to error handler middleware', async () => {
            const mockError = new Error('Database error');

            AuthService.register.mockRejectedValue(mockError);

            await AuthController.register(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });
    });
});
