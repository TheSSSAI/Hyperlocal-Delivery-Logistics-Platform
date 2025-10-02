# Stage 1: Install dependencies
FROM node:18-alpine AS dependencies
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the application
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production image
FROM node:18-alpine AS production
# Set production environment
ENV NODE_ENV production

WORKDIR /usr/src/app

# Copy production dependencies from dependencies stage
COPY --from=dependencies /usr/src/app/package.json ./package.json
COPY --from=dependencies /usr/src/app/package-lock.json ./package-lock.json
RUN npm ci --omit=dev

# Copy compiled application from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Create a non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the application port
EXPOSE 3004

# Start the application
CMD ["node", "dist/main"]