import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

import { TCP_PATTERNS } from "../../../../../common/constants/tcp-patterns";

@Controller()
export class SystemMessageController {
  @MessagePattern(TCP_PATTERNS.ping)
  ping(): { ok: true; service: "authentication"; timestamp: string } {
    return {
      ok: true,
      service: "authentication",
      timestamp: new Date().toISOString(),
    };
  }
}

