# Stage 1: Install dependencies
FROM node:18-alpine AS deps
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the application
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production image
FROM node:18-alpine AS final
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copy production dependencies from deps stage
COPY --from=deps /usr/src/app/node_modules ./node_modules
# Copy built application from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose port and start application
EXPOSE 3000
CMD ["node", "dist/main"]