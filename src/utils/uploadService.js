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
                ...options
            };

            // If it's an avatar and no specific transformations provided, keep defaults
            if (folder === 'avatars' && !options.transformation) {
                uploadOptions.transformation = [
                    { width: 500, height: 500, crop: 'limit' },
                    { quality: 'auto' }
                ];
                uploadOptions.resource_type = 'image';
            }

            const uploadStream = cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
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
