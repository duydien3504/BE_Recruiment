# Multi-stage build for optimized production image
FROM node:20-alpine AS base

# Install dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev

WORKDIR /app

# Copy package files
COPY package*.json ./

# ===================================
# Development stage
# ===================================
FROM base AS development

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Start development server
CMD ["npm", "run", "dev"]

# ===================================
# Build stage
# ===================================
FROM base AS build

# Install all dependencies for building
RUN npm ci

# Copy source code
COPY . .

# Run any build steps if needed (e.g., TypeScript compilation)
# RUN npm run build

# ===================================
# Production stage
# ===================================
FROM node:20-alpine AS production

# Install production dependencies only
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    dumb-init

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source code from build stage
COPY --from=build /app/src ./src
COPY --from=build /app/scripts ./scripts

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start production server
CMD ["node", "src/server.js"]
