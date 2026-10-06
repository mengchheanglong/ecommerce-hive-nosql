FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --config.minimum-release-age=0

COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts

RUN pnpm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --config.minimum-release-age=0

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts

EXPOSE 4000

CMD ["sh", "-c", "node scripts/seed-complete-marketplace.js && node dist/main.js"]
