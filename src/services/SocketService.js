// Socket Service to manage socket.io instance
let io;

const initSocket = (server) => {
    const { Server } = require('socket.io');
    io = new Server(server, {
        cors: {
            origin: "*", // Config theo domain frontend sau này
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Join user to their specific room via userId
        socket.on('join_user_room', (userId) => {
            if (userId) {
                socket.join(`user_${userId}`);
                console.log(`Socket ${socket.id} joined room user_${userId}`);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

/**
 * Send notification to a specific user
 * @param {string|number} userId - The ID of the user to receive notification
 * @param {string} event - The socket event name (e.g., 'new_notification')
 * @param {object} data - The data to send
 */
const sendNotificationToUser = (userId, event, data) => {
    try {
        const socketIo = getIO();
        socketIo.to(`user_${userId}`).emit(event, data);
        console.log(`Notification sent to user_${userId} [${event}]`);
    } catch (error) {
        console.error('Failed to send socket notification:', error.message);
    }
};

module.exports = {
    initSocket,
    getIO,
    sendNotificationToUser,
    saveAndSendNotification: async (userId, event, data) => {
        try {
            const { NotificationRepository } = require('../repositories');
            // Save to DB first
            await NotificationRepository.create({
                userId: userId,
                title: data.title,
                message: data.message,
                type: data.type,
                isRead: false
            });
            console.log(`Notification saved to DB for user_${userId}`);

            // Then send Socket
            const socketIo = getIO();
            socketIo.to(`user_${userId}`).emit(event, data);
            console.log(`Notification sent to user_${userId} [${event}]`);
        } catch (error) {
            console.error('Failed to save/send notification:', error.message);
        }
    }
};
