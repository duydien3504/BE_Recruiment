const { validateRegister } = require('../../src/validators/authValidator');
const MESSAGES = require('../../src/constant/messages');

describe('Auth Validator', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('validateRegister', () => {
        test('should pass validation with valid data', () => {
            req.body = {
                email: 'test@example.com',
                password: 'Password123',
                full_name: 'Nguyen Van A'
            };

            validateRegister(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(req.body.role_id).toBe(3); // Default CANDIDATE
        });

        test('should pass validation with role_id provided', () => {
            req.body = {
                email: 'test@example.com',
                password: 'Password123',
                full_name: 'Nguyen Van A',
                role_id: 2
            };

            validateRegister(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(req.body.role_id).toBe(2);
        });

        test('should fail when email is missing', () => {
            req.body = {
                password: 'Password123',
                full_name: 'Nguyen Van A'
            };

            validateRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.EMAIL_REQUIRED
                }
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should fail when email is invalid format', () => {
            req.body = {
                email: 'invalid-email',
                password: 'Password123',
                full_name: 'Nguyen Van A'
            };

            validateRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.EMAIL_INVALID
                }
            });
        });

        test('should fail when password is missing', () => {
            req.body = {
                email: 'test@example.com',
                full_name: 'Nguyen Van A'
            };

            validateRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.PASSWORD_REQUIRED
                }
            });
        });

        test('should fail when password is less than 8 characters', () => {
            req.body = {
                email: 'test@example.com',
                password: 'Pass1',
                full_name: 'Nguyen Van A'
            };

            validateRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.PASSWORD_MIN_LENGTH
                }
            });
        });

        test('should fail when password has no uppercase letter', () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123',
                full_name: 'Nguyen Van A'
            };

            validateRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.PASSWORD_PATTERN
                }
            });
        });

        test('should fail when password has no number', () => {
            req.body = {
                email: 'test@example.com',
                password: 'PasswordABC',
                full_name: 'Nguyen Van A'
            };

            validateRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.PASSWORD_PATTERN
                }
            });
        });

        test('should fail when full_name is missing', () => {
            req.body = {
                email: 'test@example.com',
                password: 'Password123'
            };

            validateRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.FULL_NAME_REQUIRED
                }
            });
        });

        test('should fail when role_id is invalid (not 2 or 3)', () => {
            req.body = {
                email: 'test@example.com',
                password: 'Password123',
                full_name: 'Nguyen Van A',
                role_id: 1 // Admin - not allowed
            };

            validateRegister(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.INVALID_ROLE
                }
            });
        });

        test('should trim full_name whitespace', () => {
            req.body = {
                email: 'test@example.com',
                password: 'Password123',
                full_name: '  Nguyen Van A  '
            };

            validateRegister(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(req.body.full_name).toBe('Nguyen Van A');
        });
    });
});
