const multer = require('multer');
const MESSAGES = require('../constant/messages');

// Multer memory storage (không lưu file vào disk)
const storage = multer.memoryStorage();

// File filter - chỉ chấp nhận image
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(MESSAGES.FILE_TYPE_INVALID), false);
    }
};

// Multer config
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Middleware xử lý lỗi upload
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: {
                    code: 400,
                    message: MESSAGES.FILE_SIZE_EXCEEDED
                }
            });
        }
    }

    if (err) {
        return res.status(400).json({
            error: {
                code: 400,
                message: err.message
            }
        });
    }

    next();
};

module.exports = {
    upload,
    handleUploadError
};
