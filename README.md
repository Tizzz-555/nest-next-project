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

Create `.env` at the repo root (it is gitignored). Required contents:

```bash
GATEWAY_HTTP_PORT=3000
AUTH_TCP_HOST=127.0.0.1
AUTH_TCP_PORT=4001
MONGO_URI=mongodb://127.0.0.1:27017/authentication

# JWT (RS256)
# These are required in all environments (strict configuration).
JWT_ISSUER=nest-next-project
JWT_AUDIENCE=gateway
JWT_ACCESS_TOKEN_TTL_SECONDS=3600
JWT_PUBLIC_KEY_BASE64=...
JWT_PRIVATE_KEY_BASE64=...
```

### Generate RS256 keys (base64-encoded PEM)

Generate a private key + matching public key, then base64-encode each PEM (so they fit in `.env` without multiline issues):

```bash
# generate keys
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out jwt-private.pem
openssl rsa -in jwt-private.pem -pubout -out jwt-public.pem

# base64 encode PEMs (copy the output into .env)
base64 < jwt-private.pem
base64 < jwt-public.pem
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

## Run with Docker Compose

Build and start everything (MongoDB + authentication + gateway):

```bash
docker compose up --build
```

Then verify (from your host machine):

- `curl -s http://localhost:3000/health`
- `curl -s http://localhost:3000/auth/ping`
- `curl -s http://localhost:3000/auth/users` (requires Authorization header)

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
curl -s -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"password123"}'
```

Then call a protected route (replace `$TOKEN`):

```bash
curl -s http://localhost:3000/auth/users \
  -H "Authorization: Bearer $TOKEN"
```

- Swagger UI:
  - `http://localhost:3000/api`
