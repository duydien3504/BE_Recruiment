const multer = require('multer');
const MESSAGES = require('../constant/messages');

// Multer memory storage (không lưu file vào disk)
const storage = multer.memoryStorage();

// Image filter
const imageFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh (jpg, jpeg, png).'), false);
    }
};

// PDF filter
const pdfFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file PDF.'), false);
    }
};

// Configs
const uploadImage = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadPdf = multer({
    storage: storage,
    fileFilter: pdfFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
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
    uploadImage,
    uploadPdf,
    handleUploadError,
    // Export for testing
    imageFilter,
    pdfFilter
};
