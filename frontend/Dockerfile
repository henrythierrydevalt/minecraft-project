FROM node:20 AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set maxsockets 1 && \
    npm config set progress false

COPY package*.json ./
RUN npm install --prefer-offline --no-audit --loglevel=error || \
    (sleep 10 && npm install --prefer-offline --no-audit --loglevel=error) || \
    (sleep 20 && npm install --loglevel=error)

COPY . .

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set maxsockets 1 && \
    npm config set progress false

COPY package*.json ./
RUN npm install --only=production --prefer-offline --no-audit --loglevel=error || \
    (sleep 10 && npm install --only=production --prefer-offline --no-audit --loglevel=error) || \
    (sleep 20 && npm install --only=production --loglevel=error)

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

EXPOSE 3001

CMD ["npm", "start"]

