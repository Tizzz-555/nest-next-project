import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { RegisterUserDto } from "../../../../../common/dto/auth/register-user.dto";
import type { ListUsersRto } from "../../../../../common/rto/auth/list-users.rto";
import type { RegisterUserRto } from "../../../../../common/rto/auth/register-user.rto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("ping")
  @ApiOperation({ summary: "Ping authentication service via TCP" })
  @ApiResponse({
    status: 200,
    description: "Authentication service is reachable over TCP",
  })
  async ping(): Promise<unknown> {
    return await this.authService.pingAuthenticationService();
  }

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ status: 201, description: "User registered" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 409, description: "Email already exists" })
  async register(@Body() dto: RegisterUserDto): Promise<RegisterUserRto> {
    return await this.authService.register(dto);
  }

  @Get("users")
  @ApiOperation({ summary: "List all users" })
  @ApiResponse({ status: 200, description: "Users list" })
  async listUsers(): Promise<ListUsersRto> {
    return await this.authService.listUsers();
  }
}

