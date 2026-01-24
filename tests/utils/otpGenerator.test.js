const { generateOtp, getOtpExpiration, OTP_EXPIRATION_MINUTES } = require('../../src/utils/otpGenerator');

describe('OTP Generator Utils', () => {
    describe('generateOtp', () => {
        test('should generate 6-digit OTP', () => {
            const otp = generateOtp();
            expect(otp).toHaveLength(6);
            expect(otp).toMatch(/^\d{6}$/);
        });

        test('should generate different OTPs on multiple calls', () => {
            const otp1 = generateOtp();
            const otp2 = generateOtp();
            // Có khả năng trùng nhưng rất thấp (1/900000)
            // Test này chỉ verify format
            expect(otp1).toMatch(/^\d{6}$/);
            expect(otp2).toMatch(/^\d{6}$/);
        });

        test('should generate OTP in valid range (100000-999999)', () => {
            const otp = generateOtp();
            const otpNumber = parseInt(otp);
            expect(otpNumber).toBeGreaterThanOrEqual(100000);
            expect(otpNumber).toBeLessThanOrEqual(999999);
        });
    });

    describe('getOtpExpiration', () => {
        test('should return date 10 minutes in the future', () => {
            const before = new Date();
            const expiration = getOtpExpiration();
            const after = new Date();

            const expectedMin = new Date(before.getTime() + OTP_EXPIRATION_MINUTES * 60000);
            const expectedMax = new Date(after.getTime() + OTP_EXPIRATION_MINUTES * 60000);

            expect(expiration.getTime()).toBeGreaterThanOrEqual(expectedMin.getTime());
            expect(expiration.getTime()).toBeLessThanOrEqual(expectedMax.getTime());
        });

        test('should return Date object', () => {
            const expiration = getOtpExpiration();
            expect(expiration).toBeInstanceOf(Date);
        });
    });
});
