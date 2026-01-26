FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY nest-cli.json tsconfig.json tsconfig.base.json ./
COPY apps/authentication ./apps/authentication
COPY common ./common
COPY config ./config
COPY core ./core

RUN npx nest build authentication

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist/apps/authentication ./dist/apps/authentication

EXPOSE 4001

CMD ["node", "dist/apps/authentication/apps/authentication/src/main.js"]

