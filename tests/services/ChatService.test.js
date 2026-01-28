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
        it('should start conversation as Candidate', async () => {
            const senderId = 'user1';
            const role = 'CANDIDATE';
            const companyId = 'comp1';

            CompanyRepository.findById.mockResolvedValue({ companyId });
            ConversationRepository.findByParticipants.mockResolvedValue(null);
            ConversationRepository.create.mockResolvedValue({ conversationId: 1 });

            const result = await ChatService.startConversation(senderId, role, companyId);

            expect(CompanyRepository.findById).toHaveBeenCalledWith(companyId);
            expect(ConversationRepository.create).toHaveBeenCalledWith(expect.objectContaining({ userId: senderId, companyId }));
            expect(result).toEqual({ conversationId: 1 });
        });

        it('should throw NOT_FOUND if company not exists (Candidate)', async () => {
            CompanyRepository.findById.mockResolvedValue(null);
            await expect(ChatService.startConversation('u1', 'CANDIDATE', 'c1'))
                .rejects.toThrow('Không tìm thấy công ty.');
        });

        it('should start conversation as Employer', async () => {
            const senderId = 'user2';
            const role = 'EMPLOYER';
            const receiverId = 'user1'; // Candidate ID

            CompanyRepository.findByUserId.mockResolvedValue({ companyId: 'comp1' });
            ConversationRepository.findByParticipants.mockResolvedValue(null);
            ConversationRepository.create.mockResolvedValue({ conversationId: 1 });

            const result = await ChatService.startConversation(senderId, role, receiverId);

            expect(CompanyRepository.findByUserId).toHaveBeenCalledWith(senderId);
            expect(ConversationRepository.create).toHaveBeenCalledWith(expect.objectContaining({ userId: receiverId, companyId: 'comp1' }));
        });

        it('should throw BAD_REQUEST if employer has no company', async () => {
            CompanyRepository.findByUserId.mockResolvedValue(null);
            await expect(ChatService.startConversation('u2', 'EMPLOYER', 'u1'))
                .rejects.toThrow('Bạn không có công ty nào.');
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
    });
});
