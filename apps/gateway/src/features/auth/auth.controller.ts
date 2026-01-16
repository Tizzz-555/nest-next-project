import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";

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
}

