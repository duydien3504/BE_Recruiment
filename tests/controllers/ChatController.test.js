const ChatController = require('../../src/controllers/ChatController');
const ChatService = require('../../src/services/ChatService');
const MESSAGES = require('../../src/constant/messages');
const HTTP_STATUS = require('../../src/constant/statusCode');

jest.mock('../../src/services/ChatService');

describe('ChatController', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('startConversation', () => {
        it('should start conversation with another user (Candidate to Employer)', async () => {
            const mockConversation = {
                conversationId: 'conv1',
                userId: 'user1',
                companyId: 'comp1'
            };

            req.user = { userId: 'user1', role: 'Candidate' };
            req.body = { receiverUserId: 'emp1' };

            ChatService.startConversation.mockResolvedValue(mockConversation);

            await ChatController.startConversation(req, res, next);

            expect(ChatService.startConversation).toHaveBeenCalledWith('user1', 'Candidate', 'emp1');
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.CREATE_CONVERSATION_SUCCESS,
                data: mockConversation
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should start conversation with user (Employer to Candidate)', async () => {
            const mockConversation = {
                conversationId: 'conv1',
                userId: 'user1',
                companyId: 'comp1'
            };

            req.user = { userId: 'emp1', role: 'Employer' };
            req.body = { receiverUserId: 'user1' };

            ChatService.startConversation.mockResolvedValue(mockConversation);

            await ChatController.startConversation(req, res, next);

            expect(ChatService.startConversation).toHaveBeenCalledWith('emp1', 'Employer', 'user1');
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(next).not.toHaveBeenCalled();
        });

        it('should start conversation with employer (Admin to Employer)', async () => {
            const mockConversation = {
                conversationId: 'conv1',
                userId: 'admin1',
                companyId: 'comp1'
            };

            req.user = { userId: 'admin1', role: 'Admin' };
            req.body = { receiverUserId: 'emp1' };

            ChatService.startConversation.mockResolvedValue(mockConversation);

            await ChatController.startConversation(req, res, next);

            expect(ChatService.startConversation).toHaveBeenCalledWith('admin1', 'Admin', 'emp1');
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.CREATE_CONVERSATION_SUCCESS,
                data: mockConversation
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error when service fails', async () => {
            const mockError = new Error('Không thể tạo cuộc trò chuyện. Ít nhất một người phải là Employer.');
            mockError.status = HTTP_STATUS.BAD_REQUEST;

            req.user = { userId: 'user1', role: 'Candidate' };
            req.body = { receiverUserId: 'user2' };

            ChatService.startConversation.mockRejectedValue(mockError);

            await ChatController.startConversation(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('getConversations', () => {
        it('should get conversations for Candidate', async () => {
            const mockConversations = [
                { conversationId: 'conv1', userId: 'user1', companyId: 'comp1' }
            ];

            req.user = { userId: 'user1', role: 'Candidate' };

            ChatService.getConversations.mockResolvedValue(mockConversations);

            await ChatController.getConversations(req, res, next);

            expect(ChatService.getConversations).toHaveBeenCalledWith('user1', 'Candidate');
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.GET_CONVERSATIONS_SUCCESS,
                data: mockConversations
            });
        });

        it('should get conversations for Employer', async () => {
            const mockConversations = [
                { conversationId: 'conv1', userId: 'user1', companyId: 'comp1' }
            ];

            req.user = { userId: 'emp1', role: 'Employer' };

            ChatService.getConversations.mockResolvedValue(mockConversations);

            await ChatController.getConversations(req, res, next);

            expect(ChatService.getConversations).toHaveBeenCalledWith('emp1', 'Employer');
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        });

        it('should get only own conversations for Admin', async () => {
            const mockConversations = [
                { conversationId: 'conv1', userId: 'admin1', companyId: 'comp1' }
            ];

            req.user = { userId: 'admin1', role: 'Admin' };

            ChatService.getConversations.mockResolvedValue(mockConversations);

            await ChatController.getConversations(req, res, next);

            expect(ChatService.getConversations).toHaveBeenCalledWith('admin1', 'Admin');
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.GET_CONVERSATIONS_SUCCESS,
                data: mockConversations
            });
        });

        it('should call next with error when service fails', async () => {
            const mockError = new Error('Database error');

            req.user = { userId: 'user1', role: 'Candidate' };

            ChatService.getConversations.mockRejectedValue(mockError);

            await ChatController.getConversations(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    describe('getMessages', () => {
        it('should get messages for Candidate participant', async () => {
            const mockMessages = [
                { messageId: 'msg1', content: 'Hello' }
            ];

            req.user = { userId: 'user1', role: 'Candidate' };
            req.params = { id: 'conv1' };

            ChatService.getMessages.mockResolvedValue(mockMessages);

            await ChatController.getMessages(req, res, next);

            expect(ChatService.getMessages).toHaveBeenCalledWith('user1', 'Candidate', 'conv1');
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.GET_MESSAGES_SUCCESS,
                data: mockMessages
            });
        });

        it('should get messages for Employer participant', async () => {
            const mockMessages = [
                { messageId: 'msg1', content: 'Hello' }
            ];

            req.user = { userId: 'emp1', role: 'Employer' };
            req.params = { id: 'conv1' };

            ChatService.getMessages.mockResolvedValue(mockMessages);

            await ChatController.getMessages(req, res, next);

            expect(ChatService.getMessages).toHaveBeenCalledWith('emp1', 'Employer', 'conv1');
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        });

        it('should allow Admin to view any conversation messages', async () => {
            const mockMessages = [
                { messageId: 'msg1', content: 'Hello' }
            ];

            req.user = { userId: 'admin1', role: 'Admin' };
            req.params = { id: 'conv1' };

            ChatService.getMessages.mockResolvedValue(mockMessages);

            await ChatController.getMessages(req, res, next);

            expect(ChatService.getMessages).toHaveBeenCalledWith('admin1', 'Admin', 'conv1');
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.GET_MESSAGES_SUCCESS,
                data: mockMessages
            });
        });

        it('should call next with error when user is not participant', async () => {
            const mockError = new Error(MESSAGES.FORBIDDEN);
            mockError.status = HTTP_STATUS.FORBIDDEN;

            req.user = { userId: 'user2', role: 'Candidate' };
            req.params = { id: 'conv1' };

            ChatService.getMessages.mockRejectedValue(mockError);

            await ChatController.getMessages(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should call next with error when conversation not found', async () => {
            const mockError = new Error(MESSAGES.CONVERSATION_NOT_FOUND);
            mockError.status = HTTP_STATUS.NOT_FOUND;

            req.user = { userId: 'user1', role: 'Candidate' };
            req.params = { id: 'invalid-conv' };

            ChatService.getMessages.mockRejectedValue(mockError);

            await ChatController.getMessages(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    describe('sendMessage', () => {
        it('should send message successfully for Candidate', async () => {
            const mockMessage = {
                messageId: 'msg1',
                content: 'Hello',
                senderId: 'user1'
            };

            req.user = { userId: 'user1', role: 'Candidate' };
            req.body = {
                conversationId: 'conv1',
                content: 'Hello'
            };

            ChatService.sendMessage.mockResolvedValue(mockMessage);

            await ChatController.sendMessage(req, res, next);

            expect(ChatService.sendMessage).toHaveBeenCalledWith('user1', 'Candidate', req.body);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.SEND_MESSAGE_SUCCESS,
                data: mockMessage
            });
        });

        it('should send message successfully for Employer', async () => {
            const mockMessage = {
                messageId: 'msg1',
                content: 'Hello',
                senderId: 'emp1'
            };

            req.user = { userId: 'emp1', role: 'Employer' };
            req.body = {
                conversationId: 'conv1',
                content: 'Hello'
            };

            ChatService.sendMessage.mockResolvedValue(mockMessage);

            await ChatController.sendMessage(req, res, next);

            expect(ChatService.sendMessage).toHaveBeenCalledWith('emp1', 'Employer', req.body);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        });

        it('should send message successfully for Admin', async () => {
            const mockMessage = {
                messageId: 'msg1',
                content: 'Admin message',
                senderId: 'admin1'
            };

            req.user = { userId: 'admin1', role: 'Admin' };
            req.body = {
                conversationId: 'conv1',
                content: 'Admin message'
            };

            ChatService.sendMessage.mockResolvedValue(mockMessage);

            await ChatController.sendMessage(req, res, next);

            expect(ChatService.sendMessage).toHaveBeenCalledWith('admin1', 'Admin', req.body);
            expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: MESSAGES.SEND_MESSAGE_SUCCESS,
                data: mockMessage
            });
        });

        it('should call next with error when service fails', async () => {
            const mockError = new Error(MESSAGES.FORBIDDEN);
            mockError.status = HTTP_STATUS.FORBIDDEN;

            req.user = { userId: 'user1', role: 'Candidate' };
            req.body = {
                conversationId: 'conv1',
                content: 'Hello'
            };

            ChatService.sendMessage.mockRejectedValue(mockError);

            await ChatController.sendMessage(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.status).not.toHaveBeenCalled();
        });
    });
});
