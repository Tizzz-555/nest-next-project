# nest-next-project

NestJS monorepo skeleton with:
- `apps/gateway`: HTTP gateway (Swagger + validation) that talks to authentication over TCP
- `apps/authentication`: TCP microservice (no HTTP) that responds to a ping message

## Prerequisites

- Node.js (recommended: 20+)
- npm

## Setup

1) Install dependencies:

```bash
npm install
```

2) Create your environment file (Cursor tooling may block committing dotfiles, so create this manually):

- Copy `env.example` to `.env` and edit values if needed.

Example:

```bash
cp env.example .env
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

- Swagger UI:
  - `http://localhost:3000/api`

