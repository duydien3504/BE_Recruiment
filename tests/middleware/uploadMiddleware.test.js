const { imageFilter, pdfFilter, handleUploadError } = require('../../src/middleware/uploadMiddleware');
const MESSAGES = require('../../src/constant/messages');

describe('uploadMiddleware', () => {
    describe('imageFilter', () => {
        test('should accept valid image types (jpeg, jpg, png)', () => {
            const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

            validMimeTypes.forEach(mimetype => {
                const file = { mimetype };
                const cb = jest.fn();

                imageFilter(null, file, cb);

                expect(cb).toHaveBeenCalledWith(null, true);
            });
        });

        test('should reject invalid file types', () => {
            const invalidMimeTypes = ['image/gif', 'application/pdf', 'text/plain'];

            invalidMimeTypes.forEach(mimetype => {
                const file = { mimetype };
                const cb = jest.fn();

                imageFilter(null, file, cb);

                expect(cb).toHaveBeenCalledWith(
                    expect.any(Error),
                    false
                );
                // Optional: Check error message
                // expect(cb.mock.calls[0][0].message).toBe('Chỉ chấp nhận file ảnh (jpg, jpeg, png).');
            });
        });
    });

    describe('pdfFilter', () => {
        test('should accept valid pdf type', () => {
            const file = { mimetype: 'application/pdf' };
            const cb = jest.fn();

            pdfFilter(null, file, cb);

            expect(cb).toHaveBeenCalledWith(null, true);
        });

        test('should reject invalid file types', () => {
            const invalidMimeTypes = ['image/jpeg', 'text/plain'];

            invalidMimeTypes.forEach(mimetype => {
                const file = { mimetype };
                const cb = jest.fn();

                pdfFilter(null, file, cb);

                expect(cb).toHaveBeenCalledWith(
                    expect.any(Error),
                    false
                );
            });
        });
    });

    describe('handleUploadError', () => {
        let req, res, next;

        beforeEach(() => {
            req = {};
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            next = jest.fn();
        });

        test('should handle file size limit error', () => {
            const multer = require('multer');
            const err = new multer.MulterError('LIMIT_FILE_SIZE');

            handleUploadError(err, req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: MESSAGES.FILE_SIZE_EXCEEDED
                }
            });
        });

        test('should handle other errors', () => {
            const err = new Error('Some error');

            handleUploadError(err, req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: {
                    code: 400,
                    message: 'Some error'
                }
            });
        });

        test('should call next when no error', () => {
            handleUploadError(null, req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });
});
