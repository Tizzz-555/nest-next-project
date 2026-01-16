import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import * as bcrypt from "bcryptjs";

import { ERROR_CODES } from "../../../../../common/errors/error-codes";
import type { ServiceError } from "../../../../../common/errors/service-error";
import type { RegisterUserDto } from "../../../../../common/dto/auth/register-user.dto";
import type { ListUsersRto } from "../../../../../common/rto/auth/list-users.rto";
import type { RegisterUserRto } from "../../../../../common/rto/auth/register-user.rto";
import type { UserRto } from "../../../../../common/rto/auth/user.rto";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async register(dto: RegisterUserDto): Promise<RegisterUserRto> {
    const email = dto.email.toLowerCase();

    const existing = await this.usersRepo.findByEmail(email);
    if (existing) {
      const err: ServiceError = {
        code: ERROR_CODES.USER_EMAIL_EXISTS,
        message: "Email already exists",
      };
      throw new RpcException(err);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const created = await this.usersRepo.createUser({ email, passwordHash });

    return { user: this.toUserRto(created) };
  }

  async listUsers(): Promise<ListUsersRto> {
    const users = await this.usersRepo.findAll();
    return { items: users.map((u) => this.toUserRto(u)) };
  }

  private toUserRto(user: { _id: unknown; email: string; createdAt?: Date }): UserRto {
    return {
      id: String(user._id),
      email: user.email,
      createdAt: (user.createdAt ?? new Date()).toISOString(),
    };
  }
}

