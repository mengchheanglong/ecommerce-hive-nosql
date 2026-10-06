FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --config.minimum-release-age=0

COPY tsconfig.json tailwind.config.ts postcss.config.js next.config.ts ./
COPY public ./public
COPY src ./src

ENV NEXT_TELEMETRY_DISABLED=1
ENV INTERNAL_API_URL=http://backend:4000

RUN pnpm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1
ENV INTERNAL_API_URL=http://backend:4000

RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

COPY package.json pnpm-lock.yaml next.config.ts ./
RUN pnpm install --prod --frozen-lockfile --config.minimum-release-age=0

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3001

CMD ["npx", "next", "start", "-p", "3001"]
