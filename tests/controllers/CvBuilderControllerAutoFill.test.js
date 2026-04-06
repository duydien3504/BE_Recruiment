const CvBuilderController = require('../../src/controllers/CvBuilderController');
const CvBuilderService = require('../../src/services/CvBuilderService');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/services/CvBuilderService');

describe('CvBuilderController.autoFillProfile', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: { userId: 'user-123' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('should auto-fill profile data successfully', async () => {
        const mockData = {
            personal: {
                fullName: 'Nguyen Van A',
                email: 'a@gmail.com',
                phoneNumber: '0123456789',
                address: 'HCM',
                avatarUrl: 'http://example.com/avatar.jpg'
            },
            about: 'Developer',
            skills: ['Node.js']
        };

        CvBuilderService.autoFillProfile.mockResolvedValue(mockData);

        await CvBuilderController.autoFillProfile(req, res, next);

        expect(CvBuilderService.autoFillProfile).toHaveBeenCalledWith('user-123');
        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Ánh xạ dữ liệu Profile thành công.',
            data: mockData
        });
    });

    it('should catch error and call next if service throws an error', async () => {
        const error = new Error('Không tìm thấy dữ liệu người dùng.');
        CvBuilderService.autoFillProfile.mockRejectedValue(error);

        await CvBuilderController.autoFillProfile(req, res, next);

        expect(CvBuilderService.autoFillProfile).toHaveBeenCalledWith('user-123');
        expect(next).toHaveBeenCalledWith(error);
    });
});
