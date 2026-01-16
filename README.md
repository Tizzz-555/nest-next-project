# nest-next-project

NestJS monorepo skeleton with:

- `apps/gateway`: HTTP gateway (Swagger + validation) that talks to authentication over TCP
- `apps/authentication`: TCP microservice (no HTTP) that responds to a ping message

## Prerequisites

- Node.js (recommended: 20+)
- npm

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file

Create `.env` at the repo root (it is gitignored). Suggested contents:

```bash
GATEWAY_HTTP_PORT=3000
AUTH_TCP_HOST=127.0.0.1
AUTH_TCP_PORT=4001
MONGO_URI=mongodb://127.0.0.1:27017/authentication
```

## Run locally (2 terminals)

Terminal 1 (authentication microservice):

```bash
npm run start:authentication:dev
```

Terminal 2 (gateway HTTP server):

```bash
npm run start:gateway:dev
```

Gateway will listen on `http://localhost:3000` by default.

## Verify

- Gateway health:

```bash
curl -s http://localhost:3000/health
```

- Ping authentication service via TCP through gateway:

```bash
curl -s http://localhost:3000/auth/ping
```

- Register a user:

```bash
curl -s -X POST http://localhost:3000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"password123"}'
```

- List users:

```bash
curl -s http://localhost:3000/auth/users
```

- Swagger UI:
  - `http://localhost:3000/api`
