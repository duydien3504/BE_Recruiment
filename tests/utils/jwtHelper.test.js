jest.mock('jsonwebtoken');

const jwt = require('jsonwebtoken');

describe('JwtHelper', () => {
    let jwtHelper;

    const mockPayload = {
        userId: 'uuid-123',
        email: 'test@example.com',
        roleId: 3
    };

    beforeAll(() => {
        process.env.JWT_SECRET = 'test-secret';
        process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
        process.env.ACCESS_TOKEN_EXPIRATION = '1d';
        process.env.REFRESH_TOKEN_EXPIRATION = '7d';
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jwtHelper = require('../../src/utils/jwtHelper');
    });

    describe('generateAccessToken', () => {
        test('should generate access token with correct payload and expiration', () => {
            const mockToken = 'mock-access-token';
            jwt.sign.mockReturnValue(mockToken);

            const result = jwtHelper.generateAccessToken(mockPayload);

            expect(jwt.sign).toHaveBeenCalledWith(
                mockPayload,
                'test-secret',
                { expiresIn: '1d' }
            );
            expect(result).toBe(mockToken);
        });
    });

    describe('generateRefreshToken', () => {
        test('should generate refresh token with correct payload and expiration', () => {
            const mockToken = 'mock-refresh-token';
            jwt.sign.mockReturnValue(mockToken);

            const result = jwtHelper.generateRefreshToken(mockPayload);

            expect(jwt.sign).toHaveBeenCalledWith(
                mockPayload,
                'test-refresh-secret',
                { expiresIn: '7d' }
            );
            expect(result).toBe(mockToken);
        });
    });

    describe('verifyAccessToken', () => {
        test('should verify and return decoded token', () => {
            const mockToken = 'valid-access-token';
            const mockDecoded = { ...mockPayload, iat: 123456, exp: 789012 };
            jwt.verify.mockReturnValue(mockDecoded);

            const result = jwtHelper.verifyAccessToken(mockToken);

            expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret');
            expect(result).toEqual(mockDecoded);
        });

        test('should throw error for invalid token', () => {
            const mockToken = 'invalid-token';
            const mockError = new Error('Invalid token');
            jwt.verify.mockImplementation(() => {
                throw mockError;
            });

            expect(() => jwtHelper.verifyAccessToken(mockToken)).toThrow('Invalid token');
            expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret');
        });
    });

    describe('verifyRefreshToken', () => {
        test('should verify and return decoded refresh token', () => {
            const mockToken = 'valid-refresh-token';
            const mockDecoded = { ...mockPayload, iat: 123456, exp: 789012 };
            jwt.verify.mockReturnValue(mockDecoded);

            const result = jwtHelper.verifyRefreshToken(mockToken);

            expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-refresh-secret');
            expect(result).toEqual(mockDecoded);
        });

        test('should throw error for expired refresh token', () => {
            const mockToken = 'expired-token';
            const mockError = new Error('Token expired');
            jwt.verify.mockImplementation(() => {
                throw mockError;
            });

            expect(() => jwtHelper.verifyRefreshToken(mockToken)).toThrow('Token expired');
        });
    });

    describe('generateTokenPair', () => {
        test('should generate both access and refresh tokens', () => {
            const mockAccessToken = 'mock-access-token';
            const mockRefreshToken = 'mock-refresh-token';

            jwt.sign
                .mockReturnValueOnce(mockAccessToken)
                .mockReturnValueOnce(mockRefreshToken);

            const result = jwtHelper.generateTokenPair(mockPayload);

            expect(jwt.sign).toHaveBeenCalledTimes(2);
            expect(jwt.sign).toHaveBeenNthCalledWith(
                1,
                mockPayload,
                'test-secret',
                { expiresIn: '1d' }
            );
            expect(jwt.sign).toHaveBeenNthCalledWith(
                2,
                mockPayload,
                'test-refresh-secret',
                { expiresIn: '7d' }
            );
            expect(result).toEqual({
                accessToken: mockAccessToken,
                refreshToken: mockRefreshToken
            });
        });
    });
});
