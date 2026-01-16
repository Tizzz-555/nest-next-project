import {
  ConflictException,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, timeout } from "rxjs";

import { TCP_PATTERNS } from "../../../../../common/constants/tcp-patterns";
import { AUTHENTICATION_CLIENT } from "../../core/clients/authentication.client";
import type { RegisterUserDto } from "../../../../../common/dto/auth/register-user.dto";
import type { RegisterUserRto } from "../../../../../common/rto/auth/register-user.rto";
import type { ListUsersRto } from "../../../../../common/rto/auth/list-users.rto";
import { ERROR_CODES } from "../../../../../common/errors/error-codes";
import type { ServiceError } from "../../../../../common/errors/service-error";

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

  async register(dto: RegisterUserDto): Promise<RegisterUserRto> {
    try {
      const res$ = this.client.send<RegisterUserRto>(TCP_PATTERNS.registerUser, dto);
      return await firstValueFrom(res$.pipe(timeout(5000)));
    } catch (err) {
      this.mapServiceError(err);
      throw err;
    }
  }

  async listUsers(): Promise<ListUsersRto> {
    try {
      const res$ = this.client.send<ListUsersRto>(TCP_PATTERNS.listUsers, {});
      return await firstValueFrom(res$.pipe(timeout(5000)));
    } catch (err) {
      this.mapServiceError(err);
      throw err;
    }
  }

  private mapServiceError(err: unknown): void {
    // Nest microservices wrap RpcException payloads; commonly available on `err.error`.
    const payload = (err as { error?: unknown })?.error as Partial<ServiceError> | undefined;
    if (!payload?.code) return;

    if (payload.code === ERROR_CODES.USER_EMAIL_EXISTS) {
      throw new ConflictException({ message: payload.message ?? "Email already exists" });
    }
  }
}

