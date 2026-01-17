import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "../../core/auth/jwt-auth.guard";
import { LoginUserDto } from "../../../../../common/dto/auth/login-user.dto";
import { RegisterUserDto } from "../../../../../common/dto/auth/register-user.dto";
import type { LoginUserRto } from "../../../../../common/rto/auth/login-user.rto";
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

  @Post("login")
  @ApiOperation({ summary: "Login and receive an access token" })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: "Logged in" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(@Body() dto: LoginUserDto): Promise<LoginUserRto> {
    return await this.authService.login(dto);
  }

  @Get("users")
  @ApiOperation({ summary: "List all users" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: "Users list" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async listUsers(): Promise<ListUsersRto> {
    return await this.authService.listUsers();
  }
}

