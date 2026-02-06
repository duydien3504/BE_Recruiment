# CD Workflow - Quick Start Guide

## 🚀 Tóm Tắt Nhanh

File CD workflow đã được tạo với đầy đủ tính năng để deploy ứng dụng Backend lên Production/Staging.

## 📁 Files Đã Tạo

```
.github/workflows/cd.yml    # CD workflow chính
Dockerfile                   # Multi-stage Docker build
.dockerignore               # Loại trừ files không cần thiết
docker-compose.yml          # Local development setup
DEPLOYMENT.md               # Hướng dẫn chi tiết
```

## ⚡ Quick Start

### 1. Cấu Hình GitHub Secrets (BẮT BUỘC)

Vào `Settings` → `Secrets and variables` → `Actions` và thêm:

**Production (Required):**
```
PRODUCTION_HOST          # VD: 123.45.67.89
PRODUCTION_USER          # VD: ubuntu
PRODUCTION_SSH_KEY       # Private SSH key
PRODUCTION_APP_PATH      # VD: /var/www/backend
PRODUCTION_URL           # VD: https://api.example.com
```

**Optional:**
```
SLACK_WEBHOOK_URL        # Slack notifications
CODECOV_TOKEN           # Code coverage reports
```

### 2. Setup Production Server

```bash
# SSH vào server
ssh user@your-server-ip

# Cài đặt Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Cài đặt PM2
sudo npm install -g pm2

# Clone repository
sudo mkdir -p /var/www/backend
sudo chown -R $USER:$USER /var/www/backend
cd /var/www/backend
git clone YOUR_REPO_URL .

# Tạo .env file
nano .env
# Paste production environment variables

# Install và start
npm ci --production
pm2 start src/server.js --name backend
pm2 save
pm2 startup
```

### 3. Deploy

**Auto Deploy:**
```bash
git push origin main
```
→ Tự động test → build → deploy

**Manual Deploy to Staging:**
1. Vào GitHub Actions
2. Chọn "Continuous Deployment"
3. Click "Run workflow"
4. Chọn "staging"

## 🔍 Workflow Stages

```
┌─────────────────┐
│  Quality Check  │  ← Run tests + coverage
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Build Docker   │  ← Build & push image
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Deploy      │  ← SSH deploy to server
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Health Check   │  ← Verify deployment
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Notify       │  ← Slack notification
└─────────────────┘
```

## 📊 Monitoring

### Check Health
```bash
curl https://your-domain.com/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2026-02-06T07:10:00.000Z",
  "uptime": 12345.67,
  "environment": "production",
  "database": "connected",
  "version": "1.0.0"
}
```

### Server Logs
```bash
# PM2 logs
pm2 logs backend

# PM2 status
pm2 status

# PM2 monitoring
pm2 monit
```

## 🐳 Local Development với Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Rebuild
docker-compose up -d --build
```

## 🔄 Rollback

Nếu deployment có vấn đề:

**Option 1: Manual Rollback**
```bash
# SSH vào server
ssh user@server

cd /var/www/backend
git reset --hard HEAD~1
npm ci --production
pm2 restart backend
```

**Option 2: GitHub Actions Rollback**
1. Vào Actions
2. Run "Continuous Deployment" workflow
3. Workflow sẽ tự động rollback

## 🛠️ Troubleshooting

### Lỗi SSH Connection
```bash
# Test SSH
ssh -i ~/.ssh/id_ed25519 user@server-ip

# Check SSH service
sudo systemctl status ssh
```

### Lỗi PM2
```bash
# Restart
pm2 restart backend

# Logs
pm2 logs backend --lines 100
```

### Lỗi Database
```bash
# Test connection
mysql -h DB_HOST -P DB_PORT -u DB_USER -p

# Check env
pm2 env 0
```

## 📚 Chi Tiết Đầy Đủ

Xem file `DEPLOYMENT.md` để có hướng dẫn chi tiết về:
- Cấu hình Nginx
- SSL/TLS setup
- Security best practices
- Advanced monitoring
- Backup strategies

## ✅ Pre-Deployment Checklist

- [ ] GitHub Secrets đã được cấu hình
- [ ] Server đã cài Node.js + PM2
- [ ] SSH key đã được setup
- [ ] `.env` production đã sẵn sàng
- [ ] Database production đã ready
- [ ] Health endpoint đã test
- [ ] Đã test trên staging

## 🎯 Next Steps

1. **Cấu hình Secrets** → Thêm vào GitHub
2. **Setup Server** → Cài đặt dependencies
3. **Test Deploy** → Deploy lên staging trước
4. **Monitor** → Kiểm tra logs và health
5. **Production** → Deploy lên production

---

**📖 Documentation:** `DEPLOYMENT.md`  
**🐛 Issues:** GitHub Issues  
**💬 Support:** Team Chat
