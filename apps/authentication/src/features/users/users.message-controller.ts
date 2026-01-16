import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

import { TCP_PATTERNS } from "../../../../../common/constants/tcp-patterns";
import type { RegisterUserDto } from "../../../../../common/dto/auth/register-user.dto";
import type { ListUsersRto } from "../../../../../common/rto/auth/list-users.rto";
import type { RegisterUserRto } from "../../../../../common/rto/auth/register-user.rto";
import { UsersService } from "./users.service";

@Controller()
export class UsersMessageController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(TCP_PATTERNS.registerUser)
  async registerUser(dto: RegisterUserDto): Promise<RegisterUserRto> {
    return await this.usersService.register(dto);
  }

  @MessagePattern(TCP_PATTERNS.listUsers)
  async listUsers(): Promise<ListUsersRto> {
    return await this.usersService.listUsers();
  }
}

