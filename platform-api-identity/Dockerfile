# Stage 1: Build the application
FROM node:18.18.0-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Build the application
RUN npm run build

# Remove development dependencies
RUN npm prune --production


# Stage 2: Create the final production image
FROM node:18.18.0-alpine

# Set working directory
WORKDIR /usr/src/app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy built application from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]