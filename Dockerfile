# Stage 1: Build dependencies
FROM node:20-slim AS builder

WORKDIR /app

# Cài đặt build tools cho các module native (vd: bcrypt)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy cấu hình package
COPY package*.json ./

# Ngăn Puppeteer tải Chromium trong lúc build (giảm dung lượng & thời gian)
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Cài đặt production dependencies
RUN npm ci --only=production


# Stage 2: Production image
FROM node:20-slim

# Thiết lập Timezone
ENV TZ=Asia/Ho_Chi_Minh

# Cài đặt các thư viện hệ thống cần thiết cho Puppeteer & Chromium
# Cài Chromium trực tiếp qua apt-get để ổn định và nhẹ hơn trên Docker
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
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
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy node_modules từ stage builder
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Copy mã nguồn ứng dụng (trừ các file trong .dockerignore)
COPY . .

# Cài đặt pm2 toàn cục để chạy runtime trong container
RUN npm install -g pm2

# Biến môi trường hệ thống
ENV NODE_ENV=production
ENV PORT=8080

# Cấu hình Puppeteer sử dụng Chromium đã cài đặt sẵn ở hệ điều hành
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Mở port
EXPOSE 8080

# Chạy app dưới quyền user node thay vì root (tăng tính bảo mật)
RUN chown -R node:node /app
USER node

# Sử dụng tini để forward các tín hiệu SIGTERM/SIGINT giúp container tắt an toàn
ENTRYPOINT ["/usr/bin/tini", "--"]

# Khởi chạy server sử dụng pm2-runtime
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
