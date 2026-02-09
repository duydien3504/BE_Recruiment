const { validateCreateLevel, validateUpdateLevel, validateLevelId } = require('../../src/validators/levelValidator');
const MESSAGES = require('../../src/constant/messages');

describe('LevelValidator', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('validateCreateLevel', () => {
        test('should pass validation with valid data', () => {
            req.body = { name: 'Senior' };

            validateCreateLevel(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should fail when name is missing', () => {
            req.body = {};

            validateCreateLevel(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.LEVEL_NAME_REQUIRED,
                errors: [MESSAGES.LEVEL_NAME_REQUIRED]
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('should fail when name is empty string', () => {
            req.body = { name: '' };

            validateCreateLevel(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: MESSAGES.LEVEL_NAME_REQUIRED
                })
            );
        });

        test('should fail when name exceeds max length', () => {
            req.body = { name: 'a'.repeat(256) };

            validateCreateLevel(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Tên cấp độ không được vượt quá 255 ký tự.'
                })
            );
        });

        test('should trim whitespace from name', () => {
            req.body = { name: '  Senior  ' };

            validateCreateLevel(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('validateUpdateLevel', () => {
        test('should pass validation with valid data', () => {
            req.body = { name: 'Senior Developer' };

            validateUpdateLevel(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should fail when name is missing', () => {
            req.body = {};

            validateUpdateLevel(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.LEVEL_NAME_REQUIRED,
                errors: [MESSAGES.LEVEL_NAME_REQUIRED]
            });
        });

        test('should fail when name is empty', () => {
            req.body = { name: '' };

            validateUpdateLevel(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('validateLevelId', () => {
        test('should pass validation with valid levelId', () => {
            req.params.levelId = '1';

            validateLevelId(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should fail when levelId is not a number', () => {
            req.params.levelId = 'abc';

            validateLevelId(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'ID cấp độ phải là số.'
                })
            );
        });

        test('should fail when levelId is negative', () => {
            req.params.levelId = '-1';

            validateLevelId(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'ID cấp độ phải là số dương.'
                })
            );
        });

        test('should fail when levelId is zero', () => {
            req.params.levelId = '0';

            validateLevelId(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'ID cấp độ phải là số dương.'
                })
            );
        });

        test('should pass with large valid levelId', () => {
            req.params.levelId = '999999';

            validateLevelId(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });
});
