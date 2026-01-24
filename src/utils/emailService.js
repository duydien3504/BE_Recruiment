const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendOtpEmail(email, otp, fullName) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Xác thực tài khoản - Mã OTP',
            html: `
                <h2>Xin chào ${fullName},</h2>
                <p>Cảm ơn bạn đã đăng ký tài khoản.</p>
                <p>Mã OTP của bạn là: <strong>${otp}</strong></p>
                <p>Mã này có hiệu lực trong 10 phút.</p>
                <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Lỗi gửi email:', error.message);
            return false;
        }
    }
}

module.exports = new EmailService();
