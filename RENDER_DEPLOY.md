# Hướng Dẫn Deploy lên Render.com

## 🚀 Quick Deploy

### Bước 1: Commit và Push Code

```bash
git add .
git commit -m "fix: update entry point for Render deployment"
git push origin main
```

### Bước 2: Tạo Web Service trên Render

1. Đăng nhập vào [Render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository: `duydien3504/BE_Recruiment`
4. Render sẽ tự động detect `render.yaml` và cấu hình

### Bước 3: Cấu Hình Environment Variables

Vào **Environment** tab và thêm các biến sau:

#### Database (TiDB Cloud)
```
DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=GftEQQzpiGxi6ZN.root
DB_PASSWORD=zlmGo1TNyNj1UvEA
DB_NAME=test
```

#### JWT Secrets
```
JWT_SECRET=HugonefInThuDucCity
JWT_REFRESH_SECRET=HugonefInThuDucCity
```

#### Email SMTP
```
EMAIL_USER=shopbi1.10shopee@gmail.com
EMAIL_PASSWORD=tkyb obax pdxe omjs
EMAIL_FROM=shopbi1.10shopee@gmail.com
```

#### Cloudinary
```
CLOUDINARY_CLOUD_NAME=djn694zux
CLOUDINARY_API_KEY=749846289138488
CLOUDINARY_API_SECRET=W1DxMQ9UblSfY-DeFHq-iQqh0Ds
```

#### VNPAY
```
vnp_TmnCode=WQ4FO340
vnp_HashSecret=OCMNPXE7DFXNQR0MV4WT0JK13RN25NMS
vnp_Return_Url=https://YOUR-RENDER-URL.onrender.com/api/v1/payments/callback
```

#### OpenRouter AI
```
API_KEY=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
```

### Bước 4: Deploy

Click **"Create Web Service"** → Render sẽ tự động deploy

---

## 📋 Cấu Hình Thủ Công (Nếu không dùng render.yaml)

Nếu Render không tự động detect `render.yaml`, cấu hình thủ công:

### Build Settings
```
Build Command:    npm install
Start Command:    node src/server.js
```

### Advanced Settings
```
Health Check Path:  /health
Auto-Deploy:        Yes
```

---

## 🔍 Kiểm Tra Deployment

### 1. Check Logs
Vào **Logs** tab để xem quá trình deploy

### 2. Test Health Endpoint
```bash
curl https://your-app.onrender.com/health
```

Response mong đợi:
```json
{
  "status": "OK",
  "timestamp": "2026-02-06T07:15:00.000Z",
  "uptime": 123.45,
  "environment": "production",
  "database": "connected",
  "version": "1.0.0"
}
```

### 3. Test API
```bash
curl https://your-app.onrender.com/
```

Response:
```json
{
  "message": "Welcome to Recruitment System API",
  "docs": "/api-docs"
}
```

### 4. Swagger UI
Truy cập: `https://your-app.onrender.com/api-docs`

---

## ⚠️ Lưu Ý Quan Trọng

### 1. Free Plan Limitations
- **Sleep after 15 minutes** of inactivity
- **750 hours/month** free
- **Cold start**: 30-60 giây khi wake up

### 2. Update VNPAY Return URL
Sau khi có URL từ Render, cập nhật:
```
vnp_Return_Url=https://YOUR-ACTUAL-URL.onrender.com/api/v1/payments/callback
```

### 3. Database Connection
TiDB Cloud đã được cấu hình sẵn, không cần thay đổi

### 4. SSL Certificate
Render tự động cung cấp SSL certificate (HTTPS)

---

## 🔧 Troubleshooting

### Lỗi: "Cannot find module"
✅ **Đã fix**: Updated `package.json` main entry point

### Lỗi: Database Connection
```bash
# Check environment variables
# Vào Render Dashboard → Environment tab
# Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD
```

### Lỗi: Application Crash
```bash
# Check logs in Render Dashboard
# Common issues:
# - Missing environment variables
# - Database connection failed
# - Port binding (Render tự động set PORT)
```

### App Sleep (Free Plan)
```bash
# Solution 1: Upgrade to paid plan ($7/month)
# Solution 2: Use external monitoring service to ping every 14 minutes
# Example: UptimeRobot, Cron-job.org
```

---

## 🎯 Auto-Deploy Setup

### Đã cấu hình sẵn trong render.yaml:
```yaml
autoDeploy: true
```

Mỗi khi push code lên `main` branch, Render sẽ tự động:
1. Pull latest code
2. Run `npm install`
3. Start server với `node src/server.js`
4. Health check tại `/health`

---

## 📊 Monitoring

### Render Dashboard
- **Metrics**: CPU, Memory, Request count
- **Logs**: Real-time application logs
- **Events**: Deploy history

### Custom Monitoring
```javascript
// Health check endpoint đã có sẵn tại /health
// Response includes:
// - status
// - uptime
// - database connection
// - environment
```

---

## 🚀 Next Steps

1. ✅ Push code lên GitHub
2. ✅ Create Web Service trên Render
3. ✅ Add Environment Variables
4. ✅ Deploy
5. ✅ Test endpoints
6. ✅ Update VNPAY callback URL
7. ✅ Monitor logs

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Render Status**: https://status.render.com
- **Community**: https://community.render.com

---

## 💡 Tips

### 1. Keep Service Awake (Free Plan)
Tạo cron job để ping health endpoint mỗi 14 phút:

**UptimeRobot** (Free):
1. Đăng ký tại https://uptimerobot.com
2. Add Monitor → HTTP(s)
3. URL: `https://your-app.onrender.com/health`
4. Interval: 5 minutes

**Cron-job.org** (Free):
1. Đăng ký tại https://cron-job.org
2. Create cronjob
3. URL: `https://your-app.onrender.com/health`
4. Schedule: Every 14 minutes

### 2. Environment-Specific Config
```javascript
// src/config/environment.js
const config = {
  development: {
    // local config
  },
  production: {
    // Render config
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
```

### 3. Database Migrations
```bash
# Add to package.json
"scripts": {
  "start": "node src/server.js",
  "postinstall": "npm run db:sync"
}
```

Render sẽ tự động chạy `db:sync` sau khi install dependencies.

---

## ✅ Checklist

- [x] Updated `package.json` main entry point
- [x] Created `render.yaml` configuration
- [x] Added `/health` endpoint
- [ ] Pushed code to GitHub
- [ ] Created Render Web Service
- [ ] Added all Environment Variables
- [ ] Tested deployment
- [ ] Updated VNPAY callback URL
- [ ] Setup monitoring/keep-awake service
