import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

import { TCP_PATTERNS } from "../../../../../common/constants/tcp-patterns";
import type { LoginUserDto } from "../../../../../common/dto/auth/login-user.dto";
import type { LoginUserRto } from "../../../../../common/rto/auth/login-user.rto";
import { AuthService } from "./auth.service";

@Controller()
export class AuthMessageController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(TCP_PATTERNS.loginUser)
  async loginUser(dto: LoginUserDto): Promise<LoginUserRto> {
    return await this.authService.login(dto);
  }
}

