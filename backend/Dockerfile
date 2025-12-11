FROM node:20-alpine AS builder

WORKDIR /app

RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

COPY package*.json ./
RUN npm install --prefer-offline --no-audit || npm install --prefer-offline --no-audit || npm install

COPY . .
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

COPY package*.json ./
RUN npm install --only=production --prefer-offline --no-audit || npm install --only=production --prefer-offline --no-audit || npm install --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]

