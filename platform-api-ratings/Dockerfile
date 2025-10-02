# Stage 1: Development - Install all dependencies, including devDependencies
FROM node:18.18-alpine AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Builder - Build the application
FROM node:18.18-alpine AS builder
WORKDIR /usr/src/app
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production - Create a slim image with only production dependencies and build artifacts
FROM node:18.18-alpine AS production
# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /usr/src/app
COPY package*.json ./
# Install only production dependencies
RUN npm install --only=production
COPY --from=builder /usr/src/app/dist ./dist
# Switch to the non-root user
USER appuser
# Expose the application port
EXPOSE 3003
# The command to run the application
CMD ["node", "dist/main"]