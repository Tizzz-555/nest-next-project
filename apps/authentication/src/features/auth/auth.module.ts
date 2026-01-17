import { Module } from "@nestjs/common";

import { UsersModule } from "../users/users.module";
import { AuthMessageController } from "./auth.message-controller";
import { AuthService } from "./auth.service";
import { TokenService } from "./token.service";

@Module({
  imports: [UsersModule],
  controllers: [AuthMessageController],
  providers: [AuthService, TokenService],
})
export class AuthModule {}

