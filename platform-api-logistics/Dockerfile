# ---- Base Stage ----
FROM node:18.18.0-alpine AS base
WORKDIR /usr/src/app
RUN apk add --no-cache libc6-compat
RUN npm i -g pnpm

# ---- Dependencies Stage ----
FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch
RUN pnpm install -r --offline

# ---- Builder Stage ----
FROM base AS builder
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ---- Production Stage ----
FROM base AS production
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch
RUN pnpm install -r --prod --offline
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD [ "node", "dist/main.js" ]