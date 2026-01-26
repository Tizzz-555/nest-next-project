FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY nest-cli.json tsconfig.json tsconfig.base.json ./
COPY apps/gateway ./apps/gateway
COPY common ./common
COPY config ./config
COPY core ./core

RUN npx nest build gateway

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist/apps/gateway ./dist/apps/gateway

EXPOSE 3000

CMD ["node", "dist/apps/gateway/apps/gateway/src/main.js"]

