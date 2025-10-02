# =================================================================
# == Dockerfile for the platform-web-vendor React Application
# =================================================================

# --- Build Stage ---
# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application for production
# This creates a 'dist' folder with static assets
RUN npm run build

# --- Production Stage ---
# Use a lightweight Nginx image to serve the static files
FROM nginx:1.25-alpine

# Copy the built assets from the 'build' stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
# This ensures that all routes are redirected to index.html for the SPA to handle routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Nginx
EXPOSE 80

# The command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]