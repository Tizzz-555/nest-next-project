import "reflect-metadata";

import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  // We create a Nest application (without listening on HTTP) so ConfigModule can load `.env`,
  // then attach the TCP microservice using values from ConfigService.
  const app = await NestFactory.create(AppModule, { logger: ["log", "error", "warn"] });
  const config = app.get(ConfigService);

  const host = config.get<string>("auth.tcpHost") ?? "0.0.0.0";
  const port = config.get<number>("auth.tcpPort") ?? 4001;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host, port },
  });

  await app.startAllMicroservices();
  await app.init();
}

void bootstrap();

