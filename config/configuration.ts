export interface AppConfiguration {
  gateway: {
    httpPort: number;
  };
  auth: {
    tcpHost: string;
    tcpPort: number;
  };
  jwt: {
    issuer: string;
    audience: string;
    accessTokenTtlSeconds: number;
    publicKeyBase64: string;
    privateKeyBase64: string;
  };
  mongo: {
    uri: string;
  };
}

function asInt(value: string | undefined, fallback: number): number {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) ? n : fallback;
}

export const configuration = (): AppConfiguration => ({
  gateway: {
    httpPort: asInt(process.env.GATEWAY_HTTP_PORT, 3000),
  },
  auth: {
    tcpHost: process.env.AUTH_TCP_HOST ?? "127.0.0.1",
    tcpPort: asInt(process.env.AUTH_TCP_PORT, 4001),
  },
  jwt: {
    // Strict: require explicit configuration (no defaults).
    issuer: process.env.JWT_ISSUER ?? "",
    audience: process.env.JWT_AUDIENCE ?? "",
    accessTokenTtlSeconds: asInt(process.env.JWT_ACCESS_TOKEN_TTL_SECONDS, 0),
    publicKeyBase64: process.env.JWT_PUBLIC_KEY_BASE64 ?? "",
    privateKeyBase64: process.env.JWT_PRIVATE_KEY_BASE64 ?? "",
  },
  mongo: {
    uri: process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/authentication",
  },
});
