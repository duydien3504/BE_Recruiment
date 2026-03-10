# Backend - Recruitment System

Dự án Backend cho hệ thống tuyển dụng sử dụng Node.js, Express và PostgreSQL (Neon Cloud).

## 1. Yêu cầu hệ thống
- Node.js (phiên bản >= 16.x)
- MySQL/PostgreSQL (Hiện tại project đang chạy trên Neon PostgreSQL)

## 2. Các bước cài đặt

**Bước 1: Cài đặt thư viện**
```bash
npm install
```

**Bước 2: Cấu hình môi trường**
Tạo file `.env` tại thư mục gốc (nếu chưa có) và copy nội dung phía dưới, thay bằng thông tin database của bạn:
```env
PORT=8080
DB_HOST=your-neon-host
DB_PORT=5432
DB_USER=your-user
DB_PASSWORD=your-password
DB_NAME=neondb

JWT_SECRET=your_jwt_secret
```

**Bước 3: Chạy project**
```bash
# Chế độ phát triển (Sử dụng nodemon)
npm run dev

# Chế độ Production
npm run start
```

## 3. Database & Dữ liệu mẫu
- **Tự động đồng bộ:** Khi bạn khởi chạy server lần đầu, hệ thống sẽ tự động tạo bảng (Sync) và tự động bơm dữ liệu mẫu (Seed) nếu database của bạn đang trống.
- **Dữ liệu mẫu bao gồm:** 63 tỉnh thành, ~200 danh mục ngành nghề, 100 kỹ năng, 6 cấp độ và 300 tin tuyển dụng mẫu.

**Tài khoản test mặc định:**
- **Admin:** `duydien3504@gmail.com` / `Abcd1234@@`
- **Employer:** `themcao20@gmail.com` / `Abcd1234@`

## 4. Tài liệu API
Hệ thống sử dụng Swagger để quản lý tài liệu API. Sau khi khởi động thành công, bạn có thể truy cập tại:
- `http://localhost:8080/api-docs`

---
*Lưu ý: Nếu bạn muốn thay đổi cấu trúc database, có thể chạy lệnh `npm run db:sync` để đồng bộ thủ công.*
