import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Health")
@Controller()
export class HealthController {
  @Get("health")
  @ApiOperation({ summary: "Gateway health check" })
  @ApiResponse({ status: 200, description: "Gateway is healthy" })
  health(): { ok: true } {
    return { ok: true };
  }
}

