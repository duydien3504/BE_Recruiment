/**
 * ============================================================
 *  SIMULATION SCRIPT — PRODUCER (Không sửa code dự án)
 * ============================================================
 *  Mục đích : Giả lập 10 ứng viên ứng tuyển vào 1 bài đăng
 *             của nhà tuyển dụng, đẩy message vào RabbitMQ.
 *
 *  Cách chạy:
 *    node src/scripts/simulate_apply.js
 *
 *  Yêu cầu:
 *    - RabbitMQ đang chạy tại localhost:5672
 *      (xem hướng dẫn khởi động ở RABBITMQ_SIMULATION_GUIDE.md)
 *
 *  ⚠️  File này KHÔNG import bất kỳ module nào của dự án.
 * ============================================================
 */

'use strict';

const amqp = require('amqplib');
const { v4: uuidv4 } = require('crypto').randomUUID ? require('crypto') : { randomUUID: () => Math.random().toString(36).slice(2) };

// ─── CONFIG ──────────────────────────────────────────────────
const RABBITMQ_URL = 'amqp://guest:guest@localhost:5672';
const EXCHANGE_NAME = 'recruitment.notification.exchange';
const EXCHANGE_TYPE = 'topic';
const ROUTING_KEY = 'notification.employer.apply';

// ✅ Dữ liệu thật lấy từ DB (chạy get_employer_info.js để cập nhật)
const EMPLOYER_USER_ID = 'a2172ad6-4856-4e56-bc0e-49235b23b7b2'; // Nhà tuyển dụng - Công ty Cổ phần Hahaha
const JOB_POST_ID = 2;
const JOB_TITLE = 'Tuyển gấp Quản lý Công nghệ Thông tin (Mới tốt nghiệp) - Junior (Vị trí số 2)';
const COMPANY_NAME = 'Công ty Cổ phần Hahaha';

// ─── DATA GIẢ LẬP 10 ỨNG VIÊN ───────────────────────────────
const FAKE_CANDIDATES = [
    { id: 'cand-001', fullName: 'Nguyễn Văn An', experienceYears: 2 },
    { id: 'cand-002', fullName: 'Trần Thị Bích', experienceYears: 4 },
    { id: 'cand-003', fullName: 'Lê Hoàng Cường', experienceYears: 1 },
    { id: 'cand-004', fullName: 'Phạm Minh Đức', experienceYears: 5 },
    { id: 'cand-005', fullName: 'Hoàng Thị Ếm', experienceYears: 3 },
    { id: 'cand-006', fullName: 'Vũ Quốc Hùng', experienceYears: 6 },
    { id: 'cand-007', fullName: 'Đặng Thị Lan', experienceYears: 2 },
    { id: 'cand-008', fullName: 'Bùi Thanh Minh', experienceYears: 7 },
    { id: 'cand-009', fullName: 'Ngô Thị Ngọc', experienceYears: 1 },
    { id: 'cand-010', fullName: 'Dương Anh Tuấn', experienceYears: 4 },
];

// ─── HÀM TẠO MESSAGE PAYLOAD ────────────────────────────────
function buildPayload(candidate, index) {
    return {
        eventId: `sim-evt-${Date.now()}-${index}`,  // ID duy nhất, chống trùng lặp
        eventType: 'CANDIDATE_APPLIED',
        timestamp: new Date().toISOString(),
        payload: {
            applicationId: 9000 + index,              // ID ứng tuyển giả lập
            jobPostId: JOB_POST_ID,
            jobTitle: JOB_TITLE,
            candidate: {
                id: candidate.id,
                fullName: candidate.fullName,
                experienceYears: candidate.experienceYears,
                coverLetter: `Xin chào, tôi là ${candidate.fullName} với ${candidate.experienceYears} năm kinh nghiệm. Tôi rất muốn ứng tuyển vào vị trí này.`
            },
            employer: {
                userId: EMPLOYER_USER_ID,
                companyName: COMPANY_NAME,
                jobPostId: JOB_POST_ID,
                jobTitle: JOB_TITLE
            }
        }
    };
}

// ─── MAIN: KẾT NỐI RABBITMQ & GỬI 10 TIN NHẮN ──────────────
async function runSimulation() {
    let connection;
    let channel;

    try {
        console.log('━'.repeat(60));
        console.log(' [SIMULATOR] Đang kết nối tới RabbitMQ...');
        console.log(`   URL: ${RABBITMQ_URL}`);
        console.log('━'.repeat(60));

        // 1. Kết nối AMQP
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();

        // 2. Khai báo Exchange (topic, durable)
        await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: true });
        console.log(` Exchange sẵn sàng: [${EXCHANGE_NAME}] (type: ${EXCHANGE_TYPE})`);

        // 3. Gửi lần lượt 10 tin nhắn
        console.log('\n Bắt đầu gửi 10 tin nhắn giả lập...\n');

        for (let i = 0; i < FAKE_CANDIDATES.length; i++) {
            const candidate = FAKE_CANDIDATES[i];
            const payload = buildPayload(candidate, i + 1);
            const msgBuffer = Buffer.from(JSON.stringify(payload));

            // persistent: true → tin nhắn được lưu trên đĩa, không mất khi RabbitMQ restart
            channel.publish(
                EXCHANGE_NAME,
                ROUTING_KEY,
                msgBuffer,
                { persistent: true, contentType: 'application/json' }
            );

            console.log(
                `  [${String(i + 1).padStart(2, '0')}/10] ✉️  Sent: ${candidate.fullName}` +
                ` (${candidate.experienceYears} yr) → eventId: ${payload.eventId}`
            );

            // Delay nhỏ 200ms giữa mỗi tin để dễ quan sát trên RabbitMQ UI
            await new Promise(r => setTimeout(r, 200));
        }

        console.log('\n━'.repeat(60));
        console.log('[SIMULATOR] Đã gửi thành công 10 tin nhắn giả lập!');
        console.log('Mở RabbitMQ UI: http://localhost:15672');
        console.log('Kiểm tra queue: recruitment.employer.apply_notification.queue');
        console.log('━'.repeat(60));

    } catch (err) {
        console.error('\n[SIMULATOR] Lỗi kết nối hoặc publish:', err.message);
        console.error('Hãy chắc chắn RabbitMQ đang chạy tại localhost:5672');
        console.error('Lệnh khởi động: docker compose up -d rabbitmq');
        process.exitCode = 1;
    } finally {
        // Đóng channel & connection an toàn
        try {
            if (channel) await channel.close();
            if (connection) await connection.close();
        } catch (_) { }
        console.log('\n🔌 [SIMULATOR] Đã đóng kết nối RabbitMQ. Done.\n');
    }
}

runSimulation();
