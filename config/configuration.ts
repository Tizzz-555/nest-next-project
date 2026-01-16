export interface AppConfiguration {
  gateway: {
    httpPort: number;
  };
  auth: {
    tcpHost: string;
    tcpPort: number;
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
});

