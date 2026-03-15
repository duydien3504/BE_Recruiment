const {
    validateMyApplicationsQuery,
    validateEmployerApplicationsQuery
} = require('../../src/validators/applicationValidator');
const HTTP_STATUS = require('../../src/constant/statusCode');
const MESSAGES = require('../../src/constant/messages');

const buildRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});
const next = jest.fn();

describe('applicationValidator.validateMyApplicationsQuery', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ─── Happy Path: no query params → sử dụng defaults ──────────────────────────
    it('should call next() and apply defaults when no query params given', () => {
        const req = { query: {} };
        const res = buildRes();

        validateMyApplicationsQuery(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.validatedQuery).toEqual({ page: 1, limit: 10 });
        expect(res.status).not.toHaveBeenCalled();
    });

    // ─── Happy Path: tất cả params hợp lệ ───────────────────────────────────────
    it('should call next() and parse valid page, limit, status', () => {
        const req = { query: { page: '2', limit: '5', status: 'Accepted' } };
        const res = buildRes();

        validateMyApplicationsQuery(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.validatedQuery).toEqual({ page: 2, limit: 5, status: 'Accepted' });
    });

    // ─── Happy Path: từng status enum hợp lệ ─────────────────────────────────────
    it.each(['Pending', 'Viewed', 'Interview', 'Accepted', 'Rejected'])(
        'should accept valid status: %s',
        (status) => {
            const req = { query: { status } };
            const res = buildRes();

            validateMyApplicationsQuery(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(req.validatedQuery.status).toBe(status);
        }
    );

    // ─── Happy Path: không truyền status thì validatedQuery không có key status ──
    it('should not set status key when status param is omitted', () => {
        const req = { query: { page: '1', limit: '10' } };
        const res = buildRes();

        validateMyApplicationsQuery(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.validatedQuery.status).toBeUndefined();
    });

    // ─── Error: status không nằm trong enum ──────────────────────────────────────
    it('should return 400 when status is not a valid enum value', () => {
        const req = { query: { status: 'INVALID_STATUS' } };
        const res = buildRes();

        validateMyApplicationsQuery(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: expect.objectContaining({
                    code: HTTP_STATUS.BAD_REQUEST,
                    message: MESSAGES.APPLICATION_STATUS_INVALID
                })
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    // ─── Error: page < 1 ─────────────────────────────────────────────────────────
    it('should return 400 when page is 0', () => {
        const req = { query: { page: '0' } };
        const res = buildRes();

        validateMyApplicationsQuery(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.objectContaining({ message: MESSAGES.PAGINATION_PAGE_INVALID })
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 when page is negative', () => {
        const req = { query: { page: '-1' } };
        const res = buildRes();

        validateMyApplicationsQuery(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 when page is text', () => {
        const req = { query: { page: 'abc' } };
        const res = buildRes();

        validateMyApplicationsQuery(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(next).not.toHaveBeenCalled();
    });

    // ─── Error: limit < 1 ────────────────────────────────────────────────────────
    it('should return 400 when limit is 0', () => {
        const req = { query: { limit: '0' } };
        const res = buildRes();

        validateMyApplicationsQuery(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.objectContaining({ message: MESSAGES.PAGINATION_LIMIT_INVALID })
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 when limit is negative', () => {
        const req = { query: { limit: '-10' } };
        const res = buildRes();

        validateMyApplicationsQuery(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(next).not.toHaveBeenCalled();
    });
});

describe('applicationValidator.validateEmployerApplicationsQuery', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should parse valid query with skillIds string and minExperience', () => {
        const req = {
            query: {
                jobPostId: '10',
                skillIds: '1,2,3',
                minExperience: '2',
                page: '1',
                limit: '20'
            }
        };
        const res = buildRes();

        validateEmployerApplicationsQuery(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.validatedQuery).toEqual({
            jobPostId: 10,
            skillIds: [1, 2, 3],
            minExperience: 2,
            page: 1,
            limit: 20
        });
    });

    it('should return 400 when skillIds format is invalid', () => {
        const req = { query: { skillIds: '1,a,3' } };
        const res = buildRes();

        validateEmployerApplicationsQuery(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.objectContaining({
                    message: MESSAGES.EMPLOYER_APPLICATION_SKILL_IDS_INVALID
                })
            })
        );
        expect(next).not.toHaveBeenCalled();
    });
});
