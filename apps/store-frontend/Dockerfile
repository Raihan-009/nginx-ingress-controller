# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies for build
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy all source files
COPY . .

# Set environment variables
ENV NEXT_PUBLIC_BACKEND_URL=https://ryuzaki.me/fastapi
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set directory permissions
RUN mkdir .next && \
    chown -R nextjs:nodejs .next

# Copy built files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js

# Copy .next folder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Ensure CSS files are copied
COPY --from=builder --chown=nextjs:nodejs /app/.next/static/css ./.next/static/css

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Switch to non-root user
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]