FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json nest-cli.json tsconfig.json tsconfig.base.json ./
COPY apps ./apps
COPY common ./common
COPY config ./config
COPY core ./core

RUN npm ci
RUN npm run build

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/apps/gateway/apps/gateway/src/main.js"]

