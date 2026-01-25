const { upload, handleUploadError } = require('../../src/middleware/uploadMiddleware');
const MESSAGES = require('../../src/constant/messages');

describe('uploadMiddleware', () => {
    describe('fileFilter', () => {
        test('should accept valid image types (jpeg, jpg, png)', () => {
            const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

            validMimeTypes.forEach(mimetype => {
                const file = { mimetype };
                const cb = jest.fn();

                upload.fileFilter(null, file, cb);

                expect(cb).toHaveBeenCalledWith(null, true);
            });
        });

        test('should reject invalid file types', () => {
            const invalidMimeTypes = ['image/gif', 'application/pdf', 'text/plain'];

            invalidMimeTypes.forEach(mimetype => {
                const file = { mimetype };
                const cb = jest.fn();

                upload.fileFilter(null, file, cb);

                expect(cb).toHaveBeenCalledWith(
                    expect.objectContaining({
                        message: MESSAGES.FILE_TYPE_INVALID
                    }),
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
