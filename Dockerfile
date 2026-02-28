FROM docker.io/node:lts-alpine AS base

FROM base AS deps
WORKDIR /app
COPY dist/api/package*.json ./
RUN npm ci --omit=dev

FROM base AS runner

# Install OpenSSL 1.1 for Prisma
RUN apk add --no-cache openssl1.1
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

WORKDIR /app

RUN addgroup --system api && \
    adduser --system -G api api

COPY --from=deps --chown=api:api /app/node_modules ./node_modules
COPY --chown=api:api dist/api .
COPY --chown=api:api src/prisma/schema.prisma ./prisma/schema.prisma

RUN npx prisma generate --schema=./prisma/schema.prisma

USER api

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:${PORT}/health || exit 1

CMD ["node", "main.js"]