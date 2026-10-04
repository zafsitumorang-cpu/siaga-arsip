# syntax=docker/dockerfile:1
# Single-stage build: pnpm monorepo (server + web), NestJS serves built SPA.
FROM node:22-alpine
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY server/package.json server/package.json
COPY web/package.json web/package.json
RUN pnpm install --frozen-lockfile
COPY server/ server/
COPY web/ web/
RUN cd web && pnpm build
RUN cd server && pnpm build
EXPOSE 3000
WORKDIR /app/server
CMD ["node", "dist/src/main.js"]
