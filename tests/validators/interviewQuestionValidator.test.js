const { validateGenerateQuestions } = require('../../src/validators/interviewQuestionValidator');
const HTTP_STATUS = require('../../src/constant/statusCode');

const buildRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

const next = jest.fn();

describe('interviewQuestionValidator.validateGenerateQuestions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call next() and set validatedParams when applicationId is valid and force_regenerate is absent', () => {
        const req = { params: { applicationId: '10' } };
        const res = buildRes();

        validateGenerateQuestions(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.validatedParams).toEqual({ applicationId: 10, force_regenerate: false });
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should set force_regenerate when passed in body', () => {
        const req = { params: { applicationId: '15' }, body: { force_regenerate: true } };
        const res = buildRes();

        validateGenerateQuestions(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.validatedParams).toEqual({ applicationId: 15, force_regenerate: true });
    });

    it('should return 400 when applicationId is invalid', () => {
        const req = { params: { applicationId: 'abc' } };
        const res = buildRes();

        validateGenerateQuestions(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: expect.objectContaining({
                    code: 400,
                    message: expect.any(String)
                })
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 when applicationId is negative', () => {
        const req = { params: { applicationId: '-1' } };
        const res = buildRes();

        validateGenerateQuestions(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });
});
