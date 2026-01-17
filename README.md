# Nest + Next Monorepo (Gateway + Auth Microservice + Web)

Full-stack monorepo featuring:

- **NestJS Gateway (`apps/gateway`)**: HTTP API with Swagger + validation. It **does not access the database**.
- **NestJS Authentication (`apps/authentication`)**: TCP microservice with business logic + persistence (MongoDB/Mongoose).
- **Next.js Web (`apps/web`)**: App Router frontend that talks to the gateway only.

## Architecture overview

- **HTTP**: Next.js → Gateway (`http://localhost:3000`)
- **Internal**: Gateway → Authentication over **TCP** (`AUTH_TCP_HOST:AUTH_TCP_PORT`)
- **Database**: Authentication → MongoDB (`MONGO_URI`)

## Requirements

- **Node.js**: 20+ recommended
- **npm**
- **Docker** (optional, for running MongoDB/services via Compose)

## Configuration

Create a `.env` file at the repo root (it’s gitignored). Minimum required:

```bash
GATEWAY_HTTP_PORT=3000
AUTH_TCP_HOST=127.0.0.1
AUTH_TCP_PORT=4001
MONGO_URI=mongodb://127.0.0.1:27017/authentication

# JWT (RS256)
JWT_ISSUER=nest-next-project
JWT_AUDIENCE=gateway
JWT_ACCESS_TOKEN_TTL_SECONDS=3600
JWT_PUBLIC_KEY_BASE64=...
JWT_PRIVATE_KEY_BASE64=...
```

### Generate RS256 keys (base64-encoded PEM)

```bash
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out jwt-private.pem
openssl rsa -in jwt-private.pem -pubout -out jwt-public.pem

# copy these outputs into .env
base64 < jwt-private.pem
base64 < jwt-public.pem
```

## Install

```bash
npm install
```

## Run (development)

### Backend (gateway + authentication)

Run both Nest services together:

```bash
npm run start:dev
```

Or run them separately:

```bash
npm run start:authentication:dev
npm run start:gateway:dev
```

### Web (Next.js)

```bash
npm run dev:web
```

## Run with Docker Compose (MongoDB + backend)

```bash
docker compose up --build
```

Then run the web app locally:

```bash
npm run dev:web
```

## Useful URLs

- **Gateway Swagger**: `http://localhost:3000/api`
- **Gateway Health**: `http://localhost:3000/health`
- **Web App**: `http://localhost:3001`

## Deployed demo (frontend)

- **Vercel (Web)**: `https://nest-next-project-jedu6wf8p-tizzz-555s-projects.vercel.app` (example page: `/users`)

Note: this deployment is **frontend-only**. The app expects the gateway at `NEXT_PUBLIC_GATEWAY_BASE_URL` (defaults to `http://localhost:3000`), so API actions require running the backend locally (see Docker/Postman sections above).

## Postman collection (API demo)

Import these files into Postman:

- `postman/nest-next-project.postman_collection.json`
- `postman/local.postman_environment.json`

Then select the environment **"nest-next-project (local)"** and run requests in this order:

1. **Health - Gateway**
2. **Auth - Ping**
3. **Auth - Register**
4. **Auth - Login (sets accessToken)** (saves `accessToken` into the environment)
5. **Auth - List Users (Bearer accessToken)**

## Scripts

- **Backend dev (gateway + auth)**: `npm run start:dev`
- **Gateway dev**: `npm run start:gateway:dev`
- **Auth dev**: `npm run start:authentication:dev`
- **Web dev**: `npm run dev:web`
- **Build backend**: `npm run build`
- **Build web**: `npm run build:web`
