const { generatePassword } = require('../../src/utils/passwordGenerator');

describe('PasswordGenerator', () => {
    describe('generatePassword', () => {
        test('should generate password with default length of 12', () => {
            const password = generatePassword();
            expect(password).toHaveLength(12);
        });

        test('should generate password with custom length', () => {
            const password = generatePassword(16);
            expect(password).toHaveLength(16);
        });

        test('should contain at least one uppercase letter', () => {
            const password = generatePassword();
            expect(password).toMatch(/[A-Z]/);
        });

        test('should contain at least one lowercase letter', () => {
            const password = generatePassword();
            expect(password).toMatch(/[a-z]/);
        });

        test('should contain at least one number', () => {
            const password = generatePassword();
            expect(password).toMatch(/[0-9]/);
        });

        test('should contain at least one special character', () => {
            const password = generatePassword();
            expect(password).toMatch(/[!@#$%^&*]/);
        });

        test('should generate different passwords on multiple calls', () => {
            const password1 = generatePassword();
            const password2 = generatePassword();
            expect(password1).not.toBe(password2);
        });

        test('should only contain allowed characters', () => {
            const password = generatePassword();
            const allowedChars = /^[A-Za-z0-9!@#$%^&*]+$/;
            expect(password).toMatch(allowedChars);
        });
    });
});
