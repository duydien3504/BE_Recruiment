/**
 * ============================================================
 *  SIMULATION SCRIPT — CONSUMER / WORKER (Không sửa code dự án)
 * ============================================================
 *  Mục đích : Lắng nghe Queue RabbitMQ, khi nhận được message
 *             giả lập sẽ:
 *               1. Ghi thông báo vào bảng `notifications` (Neon DB)
 *                  thông qua kết nối PostgreSQL trực tiếp (pg client).
 *               2. Bắn real-time Socket.io tới Employer đang online
 *                  bằng cách gọi HTTP internal API của backend.
 *
 *  Cách chạy (mở terminal riêng, song song với server):
 *    node src/scripts/notification_worker.js
 *
 *  Yêu cầu:
 *    - RabbitMQ đang chạy tại localhost:5672
 *    - Backend server đang chạy tại localhost:8080 (npm run dev)
 *
 *  ⚠️  File này KHÔNG import bất kỳ module nào của dự án.
 *      Chỉ dùng: amqplib, pg, axios, dotenv
 * ============================================================
 */

'use strict';

// Load biến môi trường từ .env của thư mục Backend
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const amqp  = require('amqplib');
const { Client } = require('pg');
const axios = require('axios');

// ─── CONFIG ──────────────────────────────────────────────────
const RABBITMQ_URL  = 'amqp://guest:guest@localhost:5672';
const EXCHANGE_NAME = 'recruitment.notification.exchange';
const EXCHANGE_TYPE = 'topic';
const QUEUE_NAME    = 'recruitment.employer.apply_notification.queue';
const ROUTING_KEY   = 'notification.employer.apply';
const PREFETCH      = 5;   // Xử lý tối đa 5 tin nhắn cùng lúc

// Internal API endpoint của Backend để relay Socket.io
// Cần đăng ký endpoint này một lần trong app.js (xem hướng dẫn bên dưới)
const BACKEND_NOTIFY_URL = `http://localhost:${process.env.PORT || 8080}/internal/notify`;
// Khóa bí mật nội bộ để Worker xác thực với backend
const INTERNAL_SECRET = process.env.INTERNAL_WORKER_SECRET || 'simulation-internal-secret-2026';

// ─── HELPER: Kết nối PostgreSQL Neon trực tiếp ────────────────
function createDbClient() {
    return new Client({
        host:     process.env.DB_HOST,
        port:     parseInt(process.env.DB_PORT) || 5432,
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl:      { require: true, rejectUnauthorized: false }
    });
}

// ─── HELPER: Lưu thông báo vào bảng notifications ─────────────
async function saveNotificationToDB(userId, title, message, type, eventId) {
    const db = createDbClient();
    await db.connect();

    try {
        // Idempotency: kiểm tra eventId đã tồn tại chưa (nhúng trong message)
        const checkResult = await db.query(
            `SELECT notification_id FROM notifications WHERE message LIKE $1 LIMIT 1`,
            [`%[ref:${eventId}]%`]
        );

        if (checkResult.rows.length > 0) {
            console.log(`  ⏭️  [WORKER] Idempotency: eventId ${eventId} đã tồn tại. Bỏ qua.`);
            return null;
        }

        // Insert thông báo mới
        const result = await db.query(
            `INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
             VALUES ($1, $2, $3, $4, false, NOW())
             RETURNING notification_id`,
            [userId, title, `${message} [ref:${eventId}]`, type]
        );

        return result.rows[0]?.notification_id;

    } finally {
        await db.end();
    }
}

// ─── HELPER: Gọi internal API để backend relay Socket.io ──────
// Backend cần có endpoint /internal/notify (xem simulate_apply.js README)
async function emitViaInternalAPI(employerUserId, notificationData) {
    try {
        await axios.post(
            BACKEND_NOTIFY_URL,
            {
                targetUserId: employerUserId,
                event:        'new_notification',
                data:         notificationData
            },
            {
                headers: {
                    'x-internal-secret': INTERNAL_SECRET,
                    'Content-Type':      'application/json'
                },
                timeout: 5000
            }
        );
        console.log(`  📡 [WORKER] Đã relay Socket.io tới employer user_${employerUserId}`);
    } catch (err) {
        // Socket.io relay thất bại KHÔNG làm hỏng luồng chính
        // Thông báo vẫn đã được lưu DB, Employer sẽ thấy khi tải lại trang
        console.warn(`  ⚠️  [WORKER] Socket relay lỗi (${err.message}). Thông báo đã lưu DB.`);
    }
}

// ─── XỬ LÝ 1 MESSAGE TỪ RABBITMQ ─────────────────────────────
async function processMessage(msg, channel) {
    let payload;

    // Parse JSON
    try {
        payload = JSON.parse(msg.content.toString());
    } catch (parseErr) {
        console.error('  ❌ [WORKER] Không parse được JSON:', parseErr.message);
        channel.nack(msg, false, false); // Reject vĩnh viễn → vào DLQ
        return;
    }

    const { eventId, payload: data } = payload;
    const employerUserId = data?.employer?.userId;
    const candidateName  = data?.candidate?.fullName  || 'Ứng viên';
    const jobTitle       = data?.jobTitle              || 'Bài đăng';
    const applicationId  = data?.applicationId;

    console.log(`\n  📨 [WORKER] Nhận: ${candidateName} → ${jobTitle}`);
    console.log(`     eventId: ${eventId}`);

    if (!employerUserId || employerUserId === 'REPLACE_WITH_REAL_EMPLOYER_USER_ID') {
        console.error('  ❌ [WORKER] employer.userId không hợp lệ. Reject message.');
        channel.nack(msg, false, false);
        return;
    }

    try {
        // ── 1. Lưu thông báo vào Database ──
        const title   = 'Có ứng viên mới!';
        const message = `Ứng viên ${candidateName} vừa ứng tuyển vào vị trí ${jobTitle}.`;

        const notificationId = await saveNotificationToDB(
            employerUserId,
            title,
            message,
            'APPLICATION',
            eventId
        );

        if (notificationId) {
            console.log(`  💾 [WORKER] Lưu DB thành công → notification_id: ${notificationId}`);
        }

        // ── 2. Relay Socket.io real-time tới Employer ──
        const notificationData = {
            notificationId: notificationId || null,
            title,
            message,
            type:          'APPLICATION',
            applicationId,
            jobPostId:     data?.jobPostId,
            isRead:        false,
            createdAt:     new Date().toISOString()
        };

        await emitViaInternalAPI(employerUserId, notificationData);

        // ── 3. ACK → Xóa tin nhắn khỏi Queue ──
        channel.ack(msg);
        console.log(`  ✅ [WORKER] ACK gửi xong → ${candidateName}`);

    } catch (err) {
        console.error(`  ⚠️  [WORKER] Lỗi xử lý:`, err.message);

        // Lỗi tạm thời (mạng, DB timeout) → requeue để retry
        const isTransient = ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND'].includes(err.code);
        channel.nack(msg, false, isTransient);

        if (isTransient) {
            console.log('  🔄 [WORKER] NACK + requeue=true (lỗi tạm thời, sẽ thử lại)');
        } else {
            console.log('  ☠️  [WORKER] NACK + requeue=false → vào Dead Letter Queue');
        }
    }
}

// ─── MAIN ─────────────────────────────────────────────────────
async function startWorker() {
    console.log('\n' + '━'.repeat(60));
    console.log('⚙️  [WORKER] Khởi động Notification Consumer Worker');
    console.log(`   RabbitMQ  : ${RABBITMQ_URL}`);
    console.log(`   Queue     : ${QUEUE_NAME}`);
    console.log(`   Neon DB   : ${process.env.DB_HOST}`);
    console.log(`   Socket API: ${BACKEND_NOTIFY_URL}`);
    console.log('━'.repeat(60) + '\n');

    let connection, channel;

    try {
        // Kết nối AMQP
        connection = await amqp.connect(RABBITMQ_URL);
        channel    = await connection.createChannel();

        // Prefetch = 5: nhận tối đa 5 msg chưa ACK tại 1 thời điểm
        channel.prefetch(PREFETCH);

        // Khai báo Exchange
        await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: true });

        // Khai báo Dead Letter Exchange (nhận các message bị reject)
        await channel.assertExchange('recruitment.notification.dlx', 'direct', { durable: true });
        await channel.assertQueue('recruitment.notification.dlq', {
            durable: true,
            arguments: { 'x-queue-type': 'classic' }
        });
        await channel.bindQueue(
            'recruitment.notification.dlq',
            'recruitment.notification.dlx',
            'dead.notification'
        );

        // Khai báo Queue chính với DLX
        await channel.assertQueue(QUEUE_NAME, {
            durable: true,
            arguments: {
                'x-dead-letter-exchange':    'recruitment.notification.dlx',
                'x-dead-letter-routing-key': 'dead.notification',
                'x-message-ttl':             86400000  // 24h TTL
            }
        });

        // Bind Queue vào Exchange theo Routing Key
        await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);

        console.log(`✅ [WORKER] Đang lắng nghe [${QUEUE_NAME}]...`);
        console.log('   ▶ Mở terminal khác và chạy: node src/scripts/simulate_apply.js\n');

        // Bắt đầu consume messages
        channel.consume(
            QUEUE_NAME,
            (msg) => { if (msg !== null) processMessage(msg, channel); },
            { noAck: false }  // Manual ACK mode
        );

        // Graceful shutdown khi nhấn Ctrl+C
        process.on('SIGINT', async () => {
            console.log('\n\n🛑 [WORKER] Dừng worker...');
            try {
                await channel.close();
                await connection.close();
            } catch (_) {}
            console.log('👋 [WORKER] Worker đã dừng an toàn.\n');
            process.exit(0);
        });

    } catch (err) {
        console.error('❌ [WORKER] Lỗi khởi động:', err.message);
        if (err.message.includes('ECONNREFUSED')) {
            console.error('   💡 RabbitMQ chưa chạy. Khởi động bằng:');
            console.error('      docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management-alpine');
        }
        process.exit(1);
    }
}

startWorker();
