# syntax=docker/dockerfile:1
# Single-stage build: pnpm monorepo (server + web), NestJS serves built SPA.
FROM node:22-alpine

# openssl is required by Prisma's query engine on Alpine
RUN apk add --no-cache openssl libc6-compat
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY server/package.json server/package.json
COPY web/package.json web/package.json
RUN pnpm install --frozen-lockfile

COPY server/ server/
COPY web/ web/

ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db?schema=public"
RUN cd server && pnpm exec prisma generate

RUN cd web && pnpm build
RUN cd server && pnpm build

EXPOSE 3000
WORKDIR /app/server
# Terapkan migrasi Prisma sebelum start (skema berjalan otomatis tiap deploy).
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
