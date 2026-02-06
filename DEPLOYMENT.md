# Hướng Dẫn Cấu Hình CD (Continuous Deployment)

## 📋 Tổng Quan

File CD workflow (`cd.yml`) đã được tạo với các tính năng sau:

### ✨ Tính Năng Chính

1. **Quality Check**: Chạy tests và kiểm tra coverage
2. **Docker Build**: Build và push Docker image lên GitHub Container Registry
3. **Multi-Environment Deployment**: 
   - Production (tự động khi push lên main/master)
   - Staging (manual trigger)
4. **Health Checks**: Kiểm tra ứng dụng sau khi deploy
5. **Notifications**: Thông báo qua Slack
6. **Rollback**: Khả năng rollback về phiên bản trước

---

## 🔐 Cấu Hình GitHub Secrets

Bạn cần cấu hình các secrets sau trong GitHub repository:

### Đi tới: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### 1. Production Secrets

```
PRODUCTION_HOST          # IP hoặc domain của production server (VD: 123.45.67.89)
PRODUCTION_USER          # SSH username (VD: ubuntu, root)
PRODUCTION_SSH_KEY       # Private SSH key để kết nối server
PRODUCTION_SSH_PORT      # SSH port (mặc định: 22)
PRODUCTION_APP_PATH      # Đường dẫn đến thư mục app trên server (VD: /var/www/backend)
PRODUCTION_URL           # URL của production app (VD: https://api.example.com)
```

### 2. Staging Secrets (Optional)

```
STAGING_HOST
STAGING_USER
STAGING_SSH_KEY
STAGING_SSH_PORT
STAGING_APP_PATH
STAGING_URL
```

### 3. Notification Secrets (Optional)

```
SLACK_WEBHOOK_URL        # Webhook URL từ Slack để nhận thông báo
CODECOV_TOKEN           # Token từ Codecov.io để upload coverage reports
```

---

## 🖥️ Cấu Hình Server Production

### Bước 1: Cài Đặt Dependencies

```bash
# Cập nhật system
sudo apt update && sudo apt upgrade -y

# Cài đặt Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Cài đặt PM2 (Process Manager)
sudo npm install -g pm2

# Cài đặt Git
sudo apt install -y git

# Cài đặt MySQL client (nếu cần)
sudo apt install -y mysql-client
```

### Bước 2: Tạo Thư Mục Application

```bash
# Tạo thư mục
sudo mkdir -p /var/www/backend
sudo chown -R $USER:$USER /var/www/backend

# Clone repository
cd /var/www/backend
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .
```

### Bước 3: Cấu Hình Environment Variables

```bash
# Tạo file .env trong production server
cd /var/www/backend
nano .env
```

Paste nội dung từ file `.env` của bạn (với thông tin production thật):

```env
PORT=8080
NODE_ENV=production

# Database Production
DB_HOST=your-production-db-host
DB_PORT=4000
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=production_db

# SSL/TLS
CA_PATH=src/config/secret/cert/isrgrootx1.pem

# JWT
JWT_SECRET=your-super-secret-jwt-key-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-production
ACCESS_TOKEN_EXPIRATION=1d
REFRESH_TOKEN_EXPIRATION=7d

# Email SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# VNPAY
vnp_TmnCode=your-vnpay-code
vnp_HashSecret=your-vnpay-secret
vnp_Url=https://vnpayment.vn/paymentv2/vpcpay.html
vnp_Return_Url=https://your-domain.com/api/v1/payments/callback

# OpenRouter
API_KEY=your-openrouter-key
API_URL=https://openrouter.ai/api/v1/chat/completions
MODEL=nvidia/nemotron-3-nano-30b-a3b:free
```

### Bước 4: Cài Đặt Dependencies và Khởi Chạy

```bash
# Install dependencies
npm ci --production

# Sync database
npm run db:sync

# Start với PM2
pm2 start src/server.js --name backend

# Lưu cấu hình PM2
pm2 save

# Cấu hình PM2 tự khởi động khi server restart
pm2 startup
# Copy và chạy lệnh mà PM2 hiển thị
```

### Bước 5: Cấu Hình Nginx (Reverse Proxy)

```bash
# Cài đặt Nginx
sudo apt install -y nginx

# Tạo cấu hình Nginx
sudo nano /etc/nginx/sites-available/backend
```

Nội dung file:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/

# Test cấu hình
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Bước 6: Cấu Hình SSL với Let's Encrypt (Optional)

```bash
# Cài đặt Certbot
sudo apt install -y certbot python3-certbot-nginx

# Lấy SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal đã được cấu hình tự động
```

---

## 🔑 Cấu Hình SSH Key

### Trên Local Machine:

```bash
# Generate SSH key pair (nếu chưa có)
ssh-keygen -t ed25519 -C "github-actions-deploy"

# Copy public key
cat ~/.ssh/id_ed25519.pub
```

### Trên Production Server:

```bash
# Thêm public key vào authorized_keys
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Paste public key vào đây

# Set permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### Thêm Private Key vào GitHub Secrets:

```bash
# Copy private key
cat ~/.ssh/id_ed25519
```

Paste vào GitHub Secret `PRODUCTION_SSH_KEY`

---

## 🚀 Sử Dụng CD Workflow

### 1. Auto Deploy (Push to main/master)

```bash
git add .
git commit -m "feat: new feature"
git push origin main
```

→ Workflow sẽ tự động chạy: Test → Build → Deploy to Production

### 2. Manual Deploy to Staging

1. Vào GitHub repository
2. Click tab `Actions`
3. Chọn workflow `Continuous Deployment`
4. Click `Run workflow`
5. Chọn `staging` trong dropdown
6. Click `Run workflow`

### 3. Rollback

1. Vào GitHub repository
2. Click tab `Actions`
3. Chọn workflow `Continuous Deployment`
4. Click `Run workflow`
5. Workflow sẽ rollback về commit trước đó

---

## 📊 Monitoring

### Kiểm Tra Logs trên Server

```bash
# PM2 logs
pm2 logs backend

# PM2 status
pm2 status

# PM2 monitoring
pm2 monit
```

### Health Check Endpoint

Thêm endpoint `/health` vào ứng dụng:

```javascript
// src/app.js hoặc src/routes/index.js
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});
```

---

## 🔧 Troubleshooting

### Lỗi SSH Connection

```bash
# Test SSH connection
ssh -i ~/.ssh/id_ed25519 user@server-ip

# Check SSH service
sudo systemctl status ssh
```

### Lỗi PM2

```bash
# Restart PM2
pm2 restart backend

# Delete và start lại
pm2 delete backend
pm2 start src/server.js --name backend
```

### Lỗi Database Connection

```bash
# Test database connection
mysql -h DB_HOST -P DB_PORT -u DB_USER -p

# Check environment variables
pm2 env 0
```

---

## 📝 Checklist Trước Khi Deploy

- [ ] Đã cấu hình tất cả GitHub Secrets
- [ ] Server đã cài đặt Node.js, PM2, Git
- [ ] SSH key đã được cấu hình đúng
- [ ] File `.env` trên server đã có đầy đủ thông tin production
- [ ] Database production đã sẵn sàng
- [ ] Nginx đã được cấu hình (nếu dùng)
- [ ] SSL certificate đã được cài đặt (nếu dùng HTTPS)
- [ ] Health check endpoint đã được implement
- [ ] Đã test workflow trên staging trước

---

## 🎯 Best Practices

1. **Luôn test trên staging trước khi deploy production**
2. **Backup database trước khi deploy**
3. **Monitor logs sau khi deploy**
4. **Có kế hoạch rollback**
5. **Sử dụng environment-specific configs**
6. **Không commit secrets vào Git**
7. **Sử dụng SSL/TLS cho production**
8. **Enable firewall và security groups**

---

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. GitHub Actions logs
2. Server PM2 logs
3. Nginx error logs: `/var/log/nginx/error.log`
4. Application logs
