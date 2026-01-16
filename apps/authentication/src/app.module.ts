import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";

import { AppConfigModule } from "../../../config/config.module";
import { SystemModule } from "./features/system/system.module";
import { UsersModule } from "./features/users/users.module";

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>("mongo.uri") ?? "mongodb://127.0.0.1:27017/authentication",
      }),
    }),
    SystemModule,
    UsersModule,
  ],
})
export class AppModule {}

