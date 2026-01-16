import { Module } from "@nestjs/common";

import { AppConfigModule } from "../../../config/config.module";
import { AuthModule } from "./features/auth/auth.module";
import { HealthModule } from "./features/health/health.module";

@Module({
  imports: [AppConfigModule, HealthModule, AuthModule],
})
export class AppModule {}

