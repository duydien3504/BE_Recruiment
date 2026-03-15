const { validateCancelApplicationParam } = require('../../src/validators/applicationValidator');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

const buildRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

const next = jest.fn();

describe('applicationValidator.validateCancelApplicationParam', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ─── Valid Cases ─────────────────────────────────────────────────────────────
    it('should call next() and set req.validatedParams when applicationId is valid positive integer', () => {
        const req = { params: { applicationId: '10' } };
        const res = buildRes();

        validateCancelApplicationParam(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.validatedParams).toEqual({ applicationId: 10 });
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should call next() for applicationId = 1 (minimum valid)', () => {
        const req = { params: { applicationId: '1' } };
        const res = buildRes();

        validateCancelApplicationParam(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.validatedParams.applicationId).toBe(1);
    });

    // ─── Invalid Cases ────────────────────────────────────────────────────────────
    it('should return 400 when applicationId is not a number (string text)', () => {
        const req = { params: { applicationId: 'abc' } };
        const res = buildRes();

        validateCancelApplicationParam(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: expect.objectContaining({
                    code: HTTP_STATUS.BAD_REQUEST,
                    message: MESSAGES.APPLICATION_ID_INVALID
                })
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 when applicationId is 0 (not positive)', () => {
        const req = { params: { applicationId: '0' } };
        const res = buildRes();

        validateCancelApplicationParam(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 when applicationId is negative', () => {
        const req = { params: { applicationId: '-5' } };
        const res = buildRes();

        validateCancelApplicationParam(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 when applicationId is a float (not integer)', () => {
        const req = { params: { applicationId: '1.5' } };
        const res = buildRes();

        validateCancelApplicationParam(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(next).not.toHaveBeenCalled();
    });
});
