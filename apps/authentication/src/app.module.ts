import { Module } from "@nestjs/common";

import { AppConfigModule } from "../../../config/config.module";
import { SystemModule } from "./features/system/system.module";

@Module({
  imports: [AppConfigModule, SystemModule],
})
export class AppModule {}

