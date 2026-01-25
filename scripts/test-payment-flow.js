const axios = require('axios');

const API_URL = 'http://localhost:8080/api/v1';
let authToken = '';

// Login để lấy token
async function login() {
    try {
        // Đăng nhập bằng tài khoản employer (đảm bảo username/password đúng)
        // Nếu chưa có, bạn cần tạo hoặc sửa lại thông tin này
        const response = await axios.post(`${API_URL}/auth/login`, {
            email: 'employer@gmail.com', // Thay bằng email employer của bạn
            password: 'password123'      // Thay bằng password của bạn
        });
        authToken = response.data.accessToken;
        console.log('✅ Đăng nhập thành công!');
        return true;
    } catch (error) {
        console.error('❌ Đăng nhập thất bại:', error.response?.data?.message || error.message);
        return false;
    }
}

// 1. Tạo Job
async function createJob() {
    try {
        const jobData = {
            title: "Test Job Payment Flow " + Date.now(),
            description: "Mô tả công việc test thanh toán",
            requirements: "Yêu cầu test",
            category_id: 1,
            location_id: 1,
            salary_min: 10000000,
            salary_max: 20000000
        };

        const response = await axios.post(`${API_URL}/jobs`, jobData, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        console.log(`✅ Tạo Job thành công! ID: ${response.data.data.jobPostId}`);
        // Giả sử response trả về transactionId trong data (nếu controller trả về)
        // Nếu không, bạn cần lấy từ paymentUrl hoặc logic khác. 
        // Tuy nhiên, controller hiện tại trả về transactionId trong response không? 
        // Kiểm tra PaymentController... À JobController trả về paymentUrl.
        // Helper vnpay trả về url chứa transactionId (vnp_TxnRef).

        const paymentUrl = response.data.data.paymentUrl;
        const urlParams = new URLSearchParams(paymentUrl.split('?')[1]);
        const transactionId = urlParams.get('vnp_TxnRef');

        console.log(`ℹ️  Transaction ID (vnp_TxnRef): ${transactionId}`);
        return { jobPostId: response.data.data.jobPostId, transactionId };
    } catch (error) {
        console.error('❌ Tạo Job thất bại:', error.response?.data?.message || error.message);
        return null;
    }
}

// 2. Mock Thanh toán thành công
async function mockPaymentSuccess(transactionId) {
    try {
        const response = await axios.post(`${API_URL}/payments/test-success`, {
            transactionId: transactionId
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        console.log('✅ Mock thanh toán thành công:', response.data.message);
        return true;
    } catch (error) {
        console.error('❌ Mock thanh toán thất bại:', error.response?.data?.message || error.message);
        return false;
    }
}

// 3. Kiểm tra trạng thái Job
async function checkJobStatus(jobId) {
    try {
        const response = await axios.get(`${API_URL}/jobs/${jobId}`);
        const status = response.data.data.status;
        console.log(`ℹ️  Trạng thái Job hiện tại: ${status}`);

        if (status === 'Active') {
            console.log('🎉 TEST THÀNH CÔNG! Job đã Active sau khi thanh toán.');
        } else {
            console.log('⚠️  TEST THẤT BẠI. Job chưa Active.');
        }
    } catch (error) {
        console.error('❌ Lấy chi tiết Job thất bại:', error.response?.data?.message || error.message);
    }
}

async function run() {
    console.log('🚀 Bắt đầu test luồng thanh toán...');

    if (await login()) {
        const result = await createJob();
        if (result) {
            console.log('⏳ Đang giả lập thanh toán...');
            await new Promise(r => setTimeout(r, 1000)); // Đợi 1s

            const success = await mockPaymentSuccess(result.transactionId);
            if (success) {
                console.log('⏳ Đang kiểm tra trạng thái Job...');
                await new Promise(r => setTimeout(r, 1000)); // Đợi 1s
                await checkJobStatus(result.jobPostId);
            }
        }
    }
}

run();
