# Backend - Hệ Thống Tuyển Dụng

Backend API xây dựng bằng Node.js, Express và PostgreSQL (Neon Cloud).

## Cài Đặt & Chạy (Đã có source và .env)

1. **Cài đặt thư viện:** 
   ```bash
   npm install
   ```
2. **Khởi động server:**
   ```bash
   npm run dev
   ```

*Server sẽ chạy tại:* http://localhost:8080

## Các Lệnh Hữu Ích

- `npm start`: Chạy chế độ Production
- `npm test`: Chạy Unit Test
- `npm run db:sync`: Cập nhật cấu trúc Database thủ công
- `npm run simulate:worker`: Chạy worker thông báo nền
- `npm run simulate:apply`: Giả lập luồng ứng tuyển

## Tài Khoản Test 

*(Tự động tạo khi database trống)*
- **Admin:** `duydien3504@gmail.com` | Pass: `Abcd1234@@`
- **Employer:** `themcao20@gmail.com` | Pass: `Abcd1234@`
- **Candidate:** `duydien1337@gmail.com` | Pass: `Abcd1234@`
## Tài Liệu API (Swagger)

Xem và test trực tiếp các endpoints tại: 
**http://localhost:8080/api-docs**
