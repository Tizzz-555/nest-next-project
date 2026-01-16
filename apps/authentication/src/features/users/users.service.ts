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

    let created;
    try {
      created = await this.usersRepo.createUser({ email, passwordHash });
    } catch (err) {
      // Race condition protection: concurrent requests can both pass the pre-check and then
      // one of them hits MongoDB duplicate key error (E11000 / code 11000).
      if (isDuplicateEmailMongoError(err)) {
        const svcErr: ServiceError = {
          code: ERROR_CODES.USER_EMAIL_EXISTS,
          message: "Email already exists",
        };
        throw new RpcException(svcErr);
      }
      throw err;
    }

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

function isDuplicateEmailMongoError(err: unknown): boolean {
  // MongoServerError shape varies by driver version; we check the widely stable bits.
  const anyErr = err as {
    code?: unknown;
    message?: unknown;
    keyPattern?: unknown;
    keyValue?: unknown;
  };

  if (anyErr?.code !== 11000) return false;

  const msg = typeof anyErr.message === "string" ? anyErr.message : "";
  const keyPattern = anyErr.keyPattern as Record<string, unknown> | undefined;
  const keyValue = anyErr.keyValue as Record<string, unknown> | undefined;

  // Prefer structured fields if present; fallback to message scan.
  if (keyPattern && "email" in keyPattern) return true;
  if (keyValue && "email" in keyValue) return true;
  return msg.includes("E11000") && msg.includes("email");
}
