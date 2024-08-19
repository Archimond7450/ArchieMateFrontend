FROM node:alpine AS base

FROM base AS deps
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM base AS runner
WORKDIR /app

RUN apk update && apk add --no-cache tzdata curl

RUN addgroup --system --gid 1001 archi
RUN adduser --system --uid 1001 archi

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown archi:archi .next

COPY --from=builder --chown=archi:archi /app/.next/standalone ./
COPY --from=builder --chown=archi:archi /app/.next/static ./.next/static

USER archi
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]