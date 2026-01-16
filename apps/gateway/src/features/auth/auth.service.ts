import { Inject, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, timeout } from "rxjs";

import { TCP_PATTERNS } from "../../../../../common/constants/tcp-patterns";
import { AUTHENTICATION_CLIENT } from "../../core/clients/authentication.client";

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTHENTICATION_CLIENT) private readonly client: ClientProxy,
  ) {}

  async pingAuthenticationService(): Promise<unknown> {
    try {
      const res$ = this.client.send(TCP_PATTERNS.ping, {});
      return await firstValueFrom(res$.pipe(timeout(2000)));
    } catch (err) {
      throw new ServiceUnavailableException({
        message: "Authentication service is unavailable",
      });
    }
  }
}

