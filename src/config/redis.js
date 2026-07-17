const Redis = require('ioredis');
require('dotenv').config();

const redisClient = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: process.env.REDIS_DB || 0,
    retryStrategy(times) {
        // Retry connection after a while
        return Math.min(times * 50, 2000);
    }
});

redisClient.on('connect', () => {
    console.log('Kết nối Redis thành công.');
});

redisClient.on('error', (err) => {
    console.error('Lỗi kết nối Redis:', err.message);
});

module.exports = redisClient;
