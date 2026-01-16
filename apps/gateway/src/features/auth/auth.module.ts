import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import {
  AUTHENTICATION_CLIENT,
  createAuthenticationClient,
} from "../../core/clients/authentication.client";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: AUTHENTICATION_CLIENT,
      useFactory: (config: ConfigService) => createAuthenticationClient(config),
      inject: [ConfigService],
    },
  ],
})
export class AuthModule {}

