# Multi-stage build for Palworld UI with optimized caching
FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./
COPY tsconfig*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci --cache /tmp/.npm --prefer-offline --no-audit

# Build stage with optimized caching
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source files that affect the build
COPY package.json package-lock.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY src/ ./src/
COPY public/ ./public/

# Build the application
RUN npm run build

# Production image, copy only necessary files
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only production dependencies and runtime files
COPY package.json package-lock.json ./
COPY tsconfig*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --cache /tmp/.npm --prefer-offline --no-audit && \
    npm cache clean --force

# Copy built application and server files
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/src/server ./src/server

# Switch to non-root user
USER nextjs

EXPOSE ${PORT}

CMD ["npx", "tsx", "src/server/index.ts"] 