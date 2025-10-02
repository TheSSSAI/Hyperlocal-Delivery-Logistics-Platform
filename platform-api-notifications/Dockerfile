# ---- Base ----
FROM node:18.18.0-alpine AS base
WORKDIR /usr/src/app
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm

# ---- Dependencies ----
FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch
RUN pnpm install --prod --frozen-lockfile

# ---- Builder ----
FROM base AS builder
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build

# ---- Production ----
FROM node:18.18.0-alpine AS production
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]