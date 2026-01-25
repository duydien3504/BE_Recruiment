const { validateUpdateProfile, validateChangePassword, validateAddSkills, validateDeleteSkill, validateUpgradeEmployer } = require('../../src/validators/userValidator');
const MESSAGES = require('../../src/constant/messages');

describe('userValidator', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('validateUpdateProfile', () => {
        test('should pass with valid full profile data', () => {
            req.body = {
                fullName: 'Nguyen Van A',
                phone: '0987654321',
                address: 'Ha Noi'
            };

            validateUpdateProfile(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should pass with partial data', () => {
            req.body = {
                fullName: 'Nguyen Van A'
            };

            validateUpdateProfile(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test('should pass with empty body (all fields optional)', () => {
            req.body = {};

            validateUpdateProfile(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test('should fail with invalid VN phone number (too short)', () => {
            req.body = {
                phone: '012345678'
            };

            validateUpdateProfile(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.PHONE_INVALID
                }
            });
        });

        test('should fail with invalid VN phone number (wrong prefix)', () => {
            req.body = {
                phone: '0223456789'
            };

            validateUpdateProfile(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should pass with valid VN phone starting with 0', () => {
            req.body = {
                phone: '0987654321'
            };

            validateUpdateProfile(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test('should fail with fullName exceeding max length', () => {
            req.body = {
                fullName: 'A'.repeat(101)
            };

            validateUpdateProfile(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should fail with invalid gender', () => {
            req.body = {
                gender: 'unknown'
            };

            validateUpdateProfile(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should pass with valid gender values', () => {
            ['male', 'female', 'other'].forEach(gender => {
                req.body = { gender };
                validateUpdateProfile(req, res, next);
                expect(next).toHaveBeenCalled();
                jest.clearAllMocks();
            });
        });

        test('should fail with invalid avatar URL', () => {
            req.body = {
                avatar: 'not-a-url'
            };

            validateUpdateProfile(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should pass with empty string for optional fields', () => {
            req.body = {
                address: '',
                bio: '',
                avatar: ''
            };

            validateUpdateProfile(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test('should fail with bio exceeding max length', () => {
            req.body = {
                bio: 'A'.repeat(501)
            };

            validateUpdateProfile(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('validateChangePassword', () => {
        test('should pass with valid old and new passwords', () => {
            req.body = {
                oldPassword: 'OldPassword123',
                newPassword: 'NewPassword456'
            };

            validateChangePassword(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should fail when oldPassword is missing', () => {
            req.body = {
                newPassword: 'NewPassword123'
            };

            validateChangePassword(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.OLD_PASSWORD_REQUIRED
                }
            });
        });

        test('should fail when newPassword is missing', () => {
            req.body = {
                oldPassword: 'OldPassword123'
            };

            validateChangePassword(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.NEW_PASSWORD_REQUIRED
                }
            });
        });

        test('should fail when newPassword is less than 8 characters', () => {
            req.body = {
                oldPassword: 'OldPassword123',
                newPassword: 'Pass1'
            };

            validateChangePassword(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.PASSWORD_MIN_LENGTH
                }
            });
        });

        test('should fail when newPassword has no uppercase letter', () => {
            req.body = {
                oldPassword: 'OldPassword123',
                newPassword: 'password123'
            };

            validateChangePassword(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.PASSWORD_PATTERN
                }
            });
        });

        test('should fail when newPassword has no number', () => {
            req.body = {
                oldPassword: 'OldPassword123',
                newPassword: 'PasswordOnly'
            };

            validateChangePassword(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.PASSWORD_PATTERN
                }
            });
        });

        test('should fail when both passwords are missing', () => {
            req.body = {};

            validateChangePassword(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should pass with minimum valid password (8 chars, 1 upper, 1 digit)', () => {
            req.body = {
                oldPassword: 'OldPass1',
                newPassword: 'NewPass1'
            };

            validateChangePassword(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('validateAddSkills', () => {
        test('should pass with valid skillIds', () => {
            req.body = {
                skillIds: [1, 2, 3]
            };

            validateAddSkills(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should fail when skillIds is missing', () => {
            req.body = {};

            validateAddSkills(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.SKILL_IDS_REQUIRED
                }
            });
        });

        test('should fail when skillIds is empty array', () => {
            req.body = {
                skillIds: []
            };

            validateAddSkills(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should fail when skillIds is not an array', () => {
            req.body = {
                skillIds: 'not-an-array'
            };

            validateAddSkills(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should fail when skillIds contains non-integers', () => {
            req.body = {
                skillIds: [1, '2.5', 3]
            };

            validateAddSkills(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should fail when skillIds contains duplicates', () => {
            req.body = {
                skillIds: [1, 1, 2]
            };

            validateAddSkills(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('validateDeleteSkill', () => {
        test('should pass with valid skillId param', () => {
            req.params = {
                skillId: 1
            };

            validateDeleteSkill(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should fail when skillId is NOT a number', () => {
            req.params = {
                skillId: 'abc'
            };

            validateDeleteSkill(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should fail when skillId is valid format but <= 0', () => {
            req.params = {
                skillId: 0
            };

            validateDeleteSkill(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('validateUpgradeEmployer', () => {
        test('should pass with valid data', () => {
            req.body = {
                tax_code: '0123456789',
                company_name: 'Tech Corp',
                address: '123 St',
                phone: '0987654321'
            };

            validateUpgradeEmployer(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should fail when tax_code is missing', () => {
            req.body = {
                company_name: 'Tech Corp'
            };

            validateUpgradeEmployer(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.TAX_CODE_REQUIRED
                }
            });
        });

        test('should fail when company_name is missing', () => {
            req.body = {
                tax_code: '0123456789'
            };

            validateUpgradeEmployer(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should fail when phone format is invalid', () => {
            req.body = {
                tax_code: '0123456789',
                company_name: 'Tech Corp',
                phone: 'invalid-phone'
            };

            validateUpgradeEmployer(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });
});
