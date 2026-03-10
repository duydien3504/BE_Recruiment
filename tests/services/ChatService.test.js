const ChatService = require('../../src/services/ChatService');
const { ConversationRepository, MessageRepository, CompanyRepository } = require('../../src/repositories');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/services/SocketService', () => ({
    getIO: jest.fn(() => ({ to: jest.fn().mockReturnThis(), emit: jest.fn() })),
    sendNotificationToUser: jest.fn(),
    saveAndSendNotification: jest.fn()
}));

jest.mock('../../src/repositories', () => ({
    ConversationRepository: {
        findById: jest.fn(),
        findByParticipants: jest.fn(),
        create: jest.fn(),
        findByUser: jest.fn(),
        findByCompany: jest.fn(),
        findAll: jest.fn(),
        updateLastMessage: jest.fn()
    },
    CompanyRepository: {
        findById: jest.fn(),
        findByUserId: jest.fn()
    },
    MessageRepository: {
        create: jest.fn(),
        findByConversation: jest.fn()
    }
}));

describe('ChatService', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('startConversation', () => {
        it('should start conversation when receiver is Employer', async () => {
            const senderId = 'user1';
            const receiverId = 'emp1';
            const companyId = 'comp1';

            // Receiver has company (is Employer)
            CompanyRepository.findByUserId.mockResolvedValueOnce({ companyId });
            // Sender doesn't have company
            CompanyRepository.findByUserId.mockResolvedValueOnce(null);

            ConversationRepository.findByParticipants.mockResolvedValue(null);
            ConversationRepository.create.mockResolvedValue({
                conversationId: 'conv1',
                userId: senderId,
                companyId
            });

            const result = await ChatService.startConversation(senderId, 'CANDIDATE', receiverId);

            expect(CompanyRepository.findByUserId).toHaveBeenCalledWith(receiverId);
            expect(ConversationRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                userId: senderId,
                companyId
            }));
            expect(result.conversationId).toBe('conv1');
        });

        it('should start conversation when sender is Employer', async () => {
            const senderId = 'emp1';
            const receiverId = 'cand1';
            const companyId = 'comp1';

            // Receiver doesn't have company
            CompanyRepository.findByUserId.mockResolvedValueOnce(null);
            // Sender has company (is Employer)
            CompanyRepository.findByUserId.mockResolvedValueOnce({ companyId });

            ConversationRepository.findByParticipants.mockResolvedValue(null);
            ConversationRepository.create.mockResolvedValue({
                conversationId: 'conv1',
                userId: receiverId,
                companyId
            });

            const result = await ChatService.startConversation(senderId, 'EMPLOYER', receiverId);

            expect(ConversationRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                userId: receiverId,
                companyId
            }));
            expect(result.conversationId).toBe('conv1');
        });

        it('should return existing conversation if already exists', async () => {
            const senderId = 'user1';
            const receiverId = 'emp1';
            const companyId = 'comp1';
            const existingConv = { conversationId: 'existing-conv', userId: senderId, companyId };

            CompanyRepository.findByUserId.mockResolvedValueOnce({ companyId });
            CompanyRepository.findByUserId.mockResolvedValueOnce(null);
            ConversationRepository.findByParticipants.mockResolvedValue(existingConv);

            const result = await ChatService.startConversation(senderId, 'CANDIDATE', receiverId);

            expect(ConversationRepository.create).not.toHaveBeenCalled();
            expect(result).toEqual(existingConv);
        });

        it('should throw BAD_REQUEST if neither sender nor receiver has company', async () => {
            // Both don't have company
            CompanyRepository.findByUserId.mockResolvedValue(null);

            await expect(ChatService.startConversation('cand1', 'CANDIDATE', 'cand2'))
                .rejects.toThrow('Không thể tạo cuộc trò chuyện. Ít nhất một người phải là Employer.');
        });

        it('should throw BAD_REQUEST if receiverUserId is not provided', async () => {
            await expect(ChatService.startConversation('admin1', 'ADMIN', null))
                .rejects.toThrow('Vui lòng cung cấp receiverUserId.');
        });

        it('should throw BAD_REQUEST if trying to message yourself', async () => {
            await expect(ChatService.startConversation('user1', 'CANDIDATE', 'user1'))
                .rejects.toThrow('Không thể tạo cuộc trò chuyện với chính mình.');
        });
    });

    describe('getConversations', () => {
        it('should get conversations for Candidate', async () => {
            ConversationRepository.findByUser.mockResolvedValue([]);
            await ChatService.getConversations('u1', 'CANDIDATE');
            expect(ConversationRepository.findByUser).toHaveBeenCalledWith('u1');
        });

        it('should get conversations for Employer', async () => {
            CompanyRepository.findByUserId.mockResolvedValue({ companyId: 'c1' });
            ConversationRepository.findByCompany.mockResolvedValue([]);

            await ChatService.getConversations('u2', 'EMPLOYER');
            expect(ConversationRepository.findByCompany).toHaveBeenCalledWith('c1');
        });

        it('should get only own conversations for Admin (not all)', async () => {
            ConversationRepository.findByUser.mockResolvedValue([
                { conversationId: 1, userId: 'admin1', companyId: 'c1' }
            ]);

            const result = await ChatService.getConversations('admin1', 'ADMIN');
            expect(ConversationRepository.findByUser).toHaveBeenCalledWith('admin1');
            expect(result).toHaveLength(1);
            expect(result[0].userId).toBe('admin1');
        });
    });

    describe('getMessages', () => {
        it('should return messages for participant (Candidate)', async () => {
            const userId = 'u1';
            const conversation = { conversationId: 1, userId: 'u1', companyId: 'c1' };
            ConversationRepository.findById.mockResolvedValue(conversation);
            MessageRepository.findByConversation.mockResolvedValue([]);

            await ChatService.getMessages(userId, 'CANDIDATE', 1);
            expect(MessageRepository.findByConversation).toHaveBeenCalledWith(1);
        });

        it('should throw FORBIDDEN if not participant', async () => {
            const conversation = { conversationId: 1, userId: 'u2', companyId: 'c1' };
            ConversationRepository.findById.mockResolvedValue(conversation);
            await expect(ChatService.getMessages('u1', 'CANDIDATE', 1)).rejects.toThrow(MESSAGES.FORBIDDEN);
        });

        it('should throw NOT_FOUND if conversation missing', async () => {
            ConversationRepository.findById.mockResolvedValue(null);
            await expect(ChatService.getMessages('u1', 'CANDIDATE', 1)).rejects.toThrow(MESSAGES.CONVERSATION_NOT_FOUND);
        });

        it('should allow Admin to view messages in their own conversation', async () => {
            const conversation = { conversationId: 1, userId: 'admin1', companyId: 'c1' };
            ConversationRepository.findById.mockResolvedValue(conversation);
            MessageRepository.findByConversation.mockResolvedValue([
                { messageId: 1, content: 'Hello' }
            ]);

            const result = await ChatService.getMessages('admin1', 'ADMIN', 1);
            expect(MessageRepository.findByConversation).toHaveBeenCalledWith(1);
            expect(result).toHaveLength(1);
        });

        it('should throw FORBIDDEN if Admin tries to view others conversation', async () => {
            const conversation = { conversationId: 1, userId: 'u1', companyId: 'c1' };
            ConversationRepository.findById.mockResolvedValue(conversation);

            await expect(ChatService.getMessages('admin1', 'ADMIN', 1))
                .rejects.toThrow(MESSAGES.FORBIDDEN);
        });
    });

    describe('sendMessage', () => {
        it('should send message as Candidate', async () => {
            const senderId = 'u1';
            // userId in conversation MATCHES senderId
            const conversation = { conversationId: 1, userId: 'u1', companyId: 'c1' };
            const company = { userId: 'employer1' };

            ConversationRepository.findById.mockResolvedValue(conversation);
            CompanyRepository.findById.mockResolvedValue(company);
            MessageRepository.create.mockResolvedValue({ createdAt: new Date() });

            await ChatService.sendMessage(senderId, 'CANDIDATE', { conversationId: 1, content: 'Hi' });

            expect(MessageRepository.create).toHaveBeenCalled();
            expect(ConversationRepository.updateLastMessage).toHaveBeenCalled();
        });

        it('should send message as Employer', async () => {
            const userId = 'emp1';
            const conversation = { conversationId: 1, userId: 'u1', companyId: 'c1' };
            const myCompany = { companyId: 'c1' };

            ConversationRepository.findById.mockResolvedValue(conversation);
            CompanyRepository.findByUserId.mockResolvedValue(myCompany);
            MessageRepository.create.mockResolvedValue({ createdAt: new Date() });

            await ChatService.sendMessage(userId, 'EMPLOYER', { conversationId: 1, content: 'Hi' });

            expect(MessageRepository.create).toHaveBeenCalled();
        });

        it('should send message as Admin (when started conversation)', async () => {
            const senderId = 'admin1';
            const conversation = { conversationId: 1, userId: 'admin1', companyId: 'c1' };
            const company = { userId: 'employer1' };

            ConversationRepository.findById.mockResolvedValue(conversation);
            CompanyRepository.findById.mockResolvedValue(company);
            MessageRepository.create.mockResolvedValue({ createdAt: new Date() });

            await ChatService.sendMessage(senderId, 'ADMIN', { conversationId: 1, content: 'Hi from Admin' });

            expect(MessageRepository.create).toHaveBeenCalled();
        });
    });
});
