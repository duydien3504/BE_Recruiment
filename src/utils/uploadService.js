const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

class UploadService {
    /**
     * Upload file to Cloudinary
     * @param {Buffer} fileBuffer - File buffer from multer
     * @param {string} folder - Cloudinary folder name
     * @returns {Promise<string>} - Cloudinary URL
     */
    async uploadToCloudinary(fileBuffer, folder = 'avatars', options = {}) {
        return new Promise((resolve, reject) => {
            const uploadOptions = {
                folder: folder,
                resource_type: options.resource_type || 'auto',
                type: 'upload',        // Chế độ 'upload' là public nhất
                access_mode: 'public',
                // Đảm bảo không có flags: 'attachment' ở đây
                ...options
            };

            // Avatar logic remains
            if (folder === 'avatars' && !options.transformation) {
                uploadOptions.resource_type = 'image';
                uploadOptions.transformation = [
                    { width: 500, height: 500, crop: 'limit' },
                    { quality: 'auto' }
                ];
            }

            const uploadStream = cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary Upload Error:', error);
                        reject(error);
                    } else {
                        console.log(`Cloudinary Upload Success: ${result.secure_url} (Access: ${result.access_mode})`);
                        resolve(result.secure_url);
                    }
                }
            );

            streamifier.createReadStream(fileBuffer).pipe(uploadStream);
        });
    }

    /**
     * Delete file from Cloudinary
     * @param {string} publicId - Cloudinary public ID
     * @returns {Promise<void>}
     */
    async deleteFromCloudinary(publicId) {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Error deleting from Cloudinary:', error);
        }
    }
}

module.exports = new UploadService();
