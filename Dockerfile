# Stage 1: Build dependencies
# Sử dụng node:20-slim (Debian) thay vì Alpine để đảm bảo tương thích tốt nhất với Puppeteer và các thư viện native
FROM node:20-slim AS builder

WORKDIR /app

# Cài đặt build tools cho các module native như bcrypt
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Cài đặt production dependencies (npm ci giúp cài đúng version đồng bộ từ package-lock.json)
RUN npm ci --only=production


# Stage 2: Production image
FROM node:20-slim

# Thiết lập Timezone (tùy chọn, hữu ích cho logs)
ENV TZ=Asia/Ho_Chi_Minh

# Cài đặt các thư viện hệ thống cần thiết cho Puppeteer (Chromium) và Tini (xử lý tín hiệu boot)
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    tini \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy node_modules và package files từ builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copy mã nguồn ứng dụng (trừ các file trong .dockerignore)
# Note: DataTest/seedData.js và src/utils/templates/... sẽ được copy qua bước này
COPY . .

# Biến môi trường quan trọng cho Railway và Puppeteer
ENV NODE_ENV=production
ENV PORT=8080
# Ngăn Puppeteer tải Chromium khi chạy (nó đã được cài đặt qua npm install ở stage 1)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false

# Expose port (Railway sẽ dùng biến PORT này)
EXPOSE 8080

# Bảo mật: Chạy dưới quyền user node thay vì root
RUN chown -R node:node /app
USER node

# Sử dụng tini để forward các tín hiệu SIGTERM/SIGINT giúp container tắt an toàn
ENTRYPOINT ["/usr/bin/tini", "--"]

# Khởi chạy server
CMD ["node", "src/server.js"]
