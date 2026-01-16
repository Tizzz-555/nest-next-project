import { Module } from "@nestjs/common";

import { SystemMessageController } from "./system.message-controller";

@Module({
  controllers: [SystemMessageController],
})
export class SystemModule {}

