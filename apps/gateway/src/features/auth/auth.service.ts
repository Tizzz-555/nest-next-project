import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, timeout } from "rxjs";

import { TCP_PATTERNS } from "../../../../../common/constants/tcp-patterns";
import { ERROR_CODES } from "../../../../../common/errors/error-codes";
import type { LoginUserDto } from "../../../../../common/dto/auth/login-user.dto";
import type { RegisterUserDto } from "../../../../../common/dto/auth/register-user.dto";
import type { LoginUserRto } from "../../../../../common/rto/auth/login-user.rto";
import type { ListUsersRto } from "../../../../../common/rto/auth/list-users.rto";
import type { RegisterUserRto } from "../../../../../common/rto/auth/register-user.rto";
import { AUTHENTICATION_CLIENT } from "../../core/clients/authentication.client";

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTHENTICATION_CLIENT) private readonly client: ClientProxy
  ) {}

  async pingAuthenticationService(): Promise<unknown> {
    try {
      const res$ = this.client.send(TCP_PATTERNS.ping, {});
      return await firstValueFrom(res$.pipe(timeout(2000)));
    } catch {
      throw new ServiceUnavailableException({
        message: "Authentication service is unavailable",
      });
    }
  }

  async register(dto: RegisterUserDto): Promise<RegisterUserRto> {
    try {
      const res$ = this.client.send<RegisterUserRto>(
        TCP_PATTERNS.registerUser,
        dto
      );
      return await firstValueFrom(res$.pipe(timeout(5000)));
    } catch (err) {
      this.mapServiceError(err);
      throw new InternalServerErrorException({
        message: "Authentication service error",
      });
    }
  }

  async login(dto: LoginUserDto): Promise<LoginUserRto> {
    try {
      const res$ = this.client.send<LoginUserRto>(TCP_PATTERNS.loginUser, dto);
      return await firstValueFrom(res$.pipe(timeout(5000)));
    } catch (err) {
      this.mapServiceError(err);
      throw new InternalServerErrorException({
        message: "Authentication service error",
      });
    }
  }

  async listUsers(): Promise<ListUsersRto> {
    try {
      const res$ = this.client.send<ListUsersRto>(TCP_PATTERNS.listUsers, {});
      return await firstValueFrom(res$.pipe(timeout(5000)));
    } catch (err) {
      this.mapServiceError(err);
      throw new InternalServerErrorException({
        message: "Authentication service error",
      });
    }
  }

  private mapServiceError(err: unknown): void {
    const e = err as any;

    if (e?.name === "TimeoutError") {
      throw new ServiceUnavailableException({
        message: "Authentication service timed out",
      });
    }

    const code: string | undefined =
      (typeof e?.code === "string" ? e.code : undefined) ??
      (typeof e?.error?.code === "string" ? e.error.code : undefined) ??
      (typeof e?.message?.code === "string" ? e.message.code : undefined);

    const message: string | undefined =
      (typeof e?.message === "string" ? e.message : undefined) ??
      (typeof e?.error?.message === "string" ? e.error.message : undefined) ??
      (typeof e?.message?.message === "string" ? e.message.message : undefined);

    if (!code) return;

    if (code === ERROR_CODES.USER_EMAIL_EXISTS) {
      throw new ConflictException({
        message: message ?? "Email already exists",
      });
    }

    if (code === ERROR_CODES.INVALID_CREDENTIALS) {
      throw new UnauthorizedException({
        message: message ?? "Invalid credentials",
      });
    }
  }
}
