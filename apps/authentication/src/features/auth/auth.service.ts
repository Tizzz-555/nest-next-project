import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import * as bcrypt from "bcryptjs";

import { ERROR_CODES } from "../../../../../common/errors/error-codes";
import type { ServiceError } from "../../../../../common/errors/service-error";
import type { LoginUserDto } from "../../../../../common/dto/auth/login-user.dto";
import type { LoginUserRto } from "../../../../../common/rto/auth/login-user.rto";
import type { UserRto } from "../../../../../common/rto/auth/user.rto";
import { UsersRepository } from "../users/users.repository";
import { TokenService } from "./token.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly tokenService: TokenService,
  ) {}

  async login(dto: LoginUserDto): Promise<LoginUserRto> {
    const email = dto.email.toLowerCase();
    const user = await this.usersRepo.findByEmail(email);

    if (!user) {
      throw new RpcException(invalidCredentialsError());
    }

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new RpcException(invalidCredentialsError());
    }

    const accessToken = await this.tokenService.signAccessToken({
      userId: String(user._id),
      email: user.email,
    });

    return {
      accessToken,
      user: toUserRto(user),
    };
  }
}

function invalidCredentialsError(): ServiceError {
  return {
    code: ERROR_CODES.INVALID_CREDENTIALS,
    message: "Invalid credentials",
  };
}

function toUserRto(user: { _id: unknown; email: string; createdAt?: Date }): UserRto {
  return {
    id: String(user._id),
    email: user.email,
    createdAt: (user.createdAt ?? new Date()).toISOString(),
  };
}

