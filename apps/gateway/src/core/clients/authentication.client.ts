import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

export const AUTHENTICATION_CLIENT = "AUTHENTICATION_CLIENT";

export function createAuthenticationClient(config: ConfigService): ClientProxy {
  const host = config.get<string>("auth.tcpHost") ?? "127.0.0.1";
  const port = config.get<number>("auth.tcpPort") ?? 4001;

  return ClientProxyFactory.create({
    transport: Transport.TCP,
    options: { host, port },
  });
}

