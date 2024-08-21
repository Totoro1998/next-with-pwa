FROM node:18.17.1-alpine AS base

FROM base AS deps
RUN echo "Checking /etc/hosts" && cat /etc/hosts
# RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && apk add --no-cache libc6-compat
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY .env.production package.json pnpm-lock.yaml .npmrc ./
RUN npm install -g pnpm && pnpm i --frozen-lockfile;

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
# ARG IMG_BASE_URL

RUN npm install -g pnpm && pnpm build

FROM base AS runner
WORKDIR /app

# ARG IMG_BASE_URL

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
# ENV NEXT_PUBLIC_IMAGE_BASE=${IMG_BASE_URL}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]