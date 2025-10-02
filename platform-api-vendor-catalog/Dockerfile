# ---- Base Stage ----
FROM node:18-alpine AS base
WORKDIR /usr/src/app
RUN apk add --no-cache libc6-compat

# ---- Dependencies Stage ----
FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci

# ---- Builder Stage ----
FROM dependencies AS builder
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM base AS production
ENV NODE_ENV production
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Create a non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3001
CMD ["node", "dist/main"]