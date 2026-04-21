const CvBuilderService = require('../../src/services/CvBuilderService');
const { UserRepository } = require('../../src/repositories');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/repositories', () => ({
    CvBuilderRepository: {
        findByUserId: jest.fn(),
        createDefault: jest.fn(),
        updateDraft: jest.fn()
    },
    UserRepository: {
        findWithSkills: jest.fn()
    }
}));

describe('CvBuilderService.autoFillProfile', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return auto-filled data when user exists', async () => {
        const mockUser = {
            fullName: 'Nguyen Van A',
            email: 'a@gmail.com',
            phoneNumber: '0123456789',
            address: 'HCM',
            avatarUrl: 'http://example.com/avatar.jpg',
            bio: 'Software Engineer',
            skills: [
                { name: 'Node.js' },
                { name: 'React' }
            ]
        };

        UserRepository.findWithSkills.mockResolvedValue(mockUser);

        const result = await CvBuilderService.autoFillProfile('user-123');

        expect(UserRepository.findWithSkills).toHaveBeenCalledWith('user-123');
        expect(result).toEqual({
            personal: {
                fullName: 'Nguyen Van A',
                email: 'a@gmail.com',
                phoneNumber: '0123456789',
                address: 'HCM',
                avatarUrl: 'http://example.com/avatar.jpg'
            },
            about: 'Software Engineer',
            skills: ['Node.js', 'React']
        });
    });

    it('should return default empty fields when user has no details or skills', async () => {
        const mockUser = {
            fullName: 'Nguyen Van B',
            email: 'b@gmail.com'
        };

        UserRepository.findWithSkills.mockResolvedValue(mockUser);

        const result = await CvBuilderService.autoFillProfile('user-456');

        expect(UserRepository.findWithSkills).toHaveBeenCalledWith('user-456');
        expect(result).toEqual({
            personal: {
                fullName: 'Nguyen Van B',
                email: 'b@gmail.com',
                phoneNumber: '',
                address: '',
                avatarUrl: ''
            },
            about: '',
            skills: []
        });
    });

    it('should throw an error with 404 status when user is not found', async () => {
        UserRepository.findWithSkills.mockResolvedValue(null);

        await expect(CvBuilderService.autoFillProfile('invalid-user'))
            .rejects
            .toMatchObject({
                message: MESSAGES.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            });

        expect(UserRepository.findWithSkills).toHaveBeenCalledWith('invalid-user');
    });
});
