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

    async sendForgotPasswordOtp(email, otp, fullName) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Đặt lại mật khẩu - Mã OTP',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #f4f4f4;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 40px auto;
                            background-color: #ffffff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }
                        .header {
                            background-color: #2563eb;
                            color: #ffffff;
                            padding: 30px 20px;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                            font-weight: 600;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .greeting {
                            font-size: 18px;
                            color: #1f2937;
                            margin-bottom: 20px;
                        }
                        .message {
                            font-size: 15px;
                            color: #4b5563;
                            line-height: 1.6;
                            margin-bottom: 30px;
                        }
                        .otp-box {
                            background-color: #f9fafb;
                            border: 2px solid #e5e7eb;
                            border-radius: 8px;
                            padding: 25px;
                            text-align: center;
                            margin: 30px 0;
                        }
                        .otp-label {
                            font-size: 14px;
                            color: #6b7280;
                            margin-bottom: 10px;
                        }
                        .otp-code {
                            font-size: 36px;
                            font-weight: 700;
                            color: #2563eb;
                            letter-spacing: 8px;
                            font-family: 'Courier New', monospace;
                        }
                        .warning {
                            background-color: #fef3c7;
                            border-left: 4px solid #f59e0b;
                            padding: 15px;
                            margin: 20px 0;
                            border-radius: 4px;
                        }
                        .warning-text {
                            font-size: 14px;
                            color: #92400e;
                            margin: 0;
                        }
                        .footer {
                            background-color: #f9fafb;
                            padding: 20px 30px;
                            text-align: center;
                            border-top: 1px solid #e5e7eb;
                        }
                        .footer-text {
                            font-size: 13px;
                            color: #6b7280;
                            margin: 5px 0;
                        }
                        .divider {
                            height: 1px;
                            background-color: #e5e7eb;
                            margin: 25px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">
                            <h1>🔐 Đặt lại mật khẩu</h1>
                        </div>
                        <div class="content">
                            <div class="greeting">Xin chào ${fullName},</div>
                            <div class="message">
                                Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. 
                                Vui lòng sử dụng mã OTP bên dưới để xác thực yêu cầu này.
                            </div>
                            
                            <div class="otp-box">
                                <div class="otp-label">MÃ OTP CỦA BẠN</div>
                                <div class="otp-code">${otp}</div>
                            </div>

                            <div class="warning">
                                <p class="warning-text">
                                    ⏱️ Mã này có hiệu lực trong <strong>10 phút</strong>. 
                                    Vui lòng không chia sẻ mã này với bất kỳ ai.
                                </p>
                            </div>

                            <div class="divider"></div>

                            <div class="message">
                                Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này. 
                                Tài khoản của bạn vẫn an toàn.
                            </div>
                        </div>
                        <div class="footer">
                            <p class="footer-text">Email này được gửi tự động, vui lòng không trả lời.</p>
                            <p class="footer-text">© 2026 Recruitment Platform. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Lỗi gửi email quên mật khẩu:', error.message);
            return false;
        }
    }

    async sendNewPassword(email, newPassword, fullName) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Mật khẩu mới của bạn',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #f4f4f4;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 40px auto;
                            background-color: #ffffff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }
                        .header {
                            background-color: #16a34a;
                            color: #ffffff;
                            padding: 30px 20px;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                            font-weight: 600;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .greeting {
                            font-size: 18px;
                            color: #1f2937;
                            margin-bottom: 20px;
                        }
                        .message {
                            font-size: 15px;
                            color: #4b5563;
                            line-height: 1.6;
                            margin-bottom: 30px;
                        }
                        .password-box {
                            background-color: #f0fdf4;
                            border: 2px solid #86efac;
                            border-radius: 8px;
                            padding: 25px;
                            text-align: center;
                            margin: 30px 0;
                        }
                        .password-label {
                            font-size: 14px;
                            color: #166534;
                            margin-bottom: 10px;
                            font-weight: 600;
                        }
                        .password-code {
                            font-size: 24px;
                            font-weight: 700;
                            color: #16a34a;
                            letter-spacing: 2px;
                            font-family: 'Courier New', monospace;
                            word-break: break-all;
                        }
                        .warning {
                            background-color: #fef3c7;
                            border-left: 4px solid #f59e0b;
                            padding: 15px;
                            margin: 20px 0;
                            border-radius: 4px;
                        }
                        .warning-text {
                            font-size: 14px;
                            color: #92400e;
                            margin: 0;
                        }
                        .footer {
                            background-color: #f9fafb;
                            padding: 20px 30px;
                            text-align: center;
                            border-top: 1px solid #e5e7eb;
                        }
                        .footer-text {
                            font-size: 13px;
                            color: #6b7280;
                            margin: 5px 0;
                        }
                        .divider {
                            height: 1px;
                            background-color: #e5e7eb;
                            margin: 25px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">
                            <h1>✅ Đặt lại mật khẩu thành công</h1>
                        </div>
                        <div class="content">
                            <div class="greeting">Xin chào ${fullName},</div>
                            <div class="message">
                                Mật khẩu của bạn đã được đặt lại thành công. 
                                Đây là mật khẩu mới của bạn:
                            </div>
                            
                            <div class="password-box">
                                <div class="password-label">MẬT KHẨU MỚI</div>
                                <div class="password-code">${newPassword}</div>
                            </div>

                            <div class="warning">
                                <p class="warning-text">
                                    🔒 Vui lòng <strong>đổi mật khẩu ngay</strong> sau khi đăng nhập lần đầu. 
                                    Không chia sẻ mật khẩu này với bất kỳ ai.
                                </p>
                            </div>

                            <div class="divider"></div>

                            <div class="message">
                                Nếu bạn không thực hiện yêu cầu này, vui lòng liên hệ với chúng tôi ngay lập tức.
                            </div>
                        </div>
                        <div class="footer">
                            <p class="footer-text">Email này được gửi tự động, vui lòng không trả lời.</p>
                            <p class="footer-text">© 2026 Recruitment Platform. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Lỗi gửi email mật khẩu mới:', error.message);
            return false;
        }
    }
}

module.exports = new EmailService();
