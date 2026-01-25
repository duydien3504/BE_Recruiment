const { validateUpdateCompany } = require('../../src/validators/companyValidator');
const MESSAGES = require('../../src/constant/messages');

describe('companyValidator', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('validateUpdateCompany', () => {
        test('should pass with valid update data', () => {
            req.body = {
                name: 'Tech Corp Updated',
                phone_number: '0987654321',
                website_url: 'https://example.com'
            };

            validateUpdateCompany(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('should fail when tax_code is present (Forbidden)', () => {
            req.body = {
                tax_code: '0123456789'
            };

            validateUpdateCompany(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.objectContaining({
                    code: 400
                })
            }));
        });

        test('should fail with invalid website url', () => {
            req.body = {
                website_url: 'invalid-url'
            };

            validateUpdateCompany(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should pass with empty optional fields', () => {
            req.body = {
                description: '',
                scale: ''
            };

            validateUpdateCompany(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });
});
