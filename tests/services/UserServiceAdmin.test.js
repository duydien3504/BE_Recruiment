const UserService = require('../../src/services/UserService');
const { UserRepository } = require('../../src/repositories');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/repositories');

describe('UserService Admin Methods', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllUsers', () => {
        it('should return list of users with pagination options', async () => {
            const query = { keyword: 'test', page: 2, limit: 5 };
            const mockUsers = [{ userId: '1', fullName: 'Test User' }];
            UserRepository.findAllUsers.mockResolvedValue(mockUsers);

            const result = await UserService.getAllUsers(query);

            expect(UserRepository.findAllUsers).toHaveBeenCalledWith(
                { keyword: 'test', role: undefined, status: undefined },
                expect.objectContaining({
                    offset: 5,
                    limit: 5,
                    order: [['created_at', 'DESC']]
                })
            );
            expect(result).toEqual(mockUsers);
        });
    });

    describe('getUserDetailForAdmin', () => {
        it('should return user detail', async () => {
            const mockUser = { userId: '1', email: 'test@example.com', fullName: 'Test', role: 'Candidate' };
            UserRepository.findById.mockResolvedValue(mockUser);

            const result = await UserService.getUserDetailForAdmin('1');

            expect(UserRepository.findById).toHaveBeenCalledWith('1');
            expect(result).toHaveProperty('email', mockUser.email);
        });

        it('should throw NOT_FOUND if user does not exist', async () => {
            UserRepository.findById.mockResolvedValue(null);
            await expect(UserService.getUserDetailForAdmin('1')).rejects.toThrow(MESSAGES.USER_NOT_FOUND);
        });
    });

    describe('updateUserStatus', () => {
        it('should update status successfully', async () => {
            const mockUser = { userId: '1', status: 'Active' };
            UserRepository.findById.mockResolvedValue(mockUser);
            UserRepository.updateStatus.mockResolvedValue([1]);

            await UserService.updateUserStatus('1', 'Banned');

            expect(UserRepository.updateStatus).toHaveBeenCalledWith('1', 'Banned');
        });

        it('should throw BAD_REQUEST if status is invalid', async () => {
            const mockUser = { userId: '1', status: 'Active' };
            UserRepository.findById.mockResolvedValue(mockUser);

            await expect(UserService.updateUserStatus('1', 'InvalidStatus')).rejects.toThrow('Trạng thái không hợp lệ.');
        });

        it('should throw NOT_FOUND if user not found', async () => {
            UserRepository.findById.mockResolvedValue(null);
            await expect(UserService.updateUserStatus('1', 'Banned')).rejects.toThrow(MESSAGES.USER_NOT_FOUND);
        });
    });
});
