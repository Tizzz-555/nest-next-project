/**
 * User representation returned from the gateway.
 * Matches backend `UserRto` in common/rto/auth/user.rto.ts
 */
export interface UserRto {
  id: string;
  email: string;
  createdAt: string;
}

/**
 * Response from POST /auth/register
 * Matches backend `RegisterUserRto` in common/rto/auth/register-user.rto.ts
 */
export interface RegisterUserRto {
  user: UserRto;
}

/**
 * Response from POST /auth/login
 * Matches backend `LoginUserRto` in common/rto/auth/login-user.rto.ts
 */
export interface LoginUserRto {
  accessToken: string;
  user: UserRto;
}

/**
 * Response from GET /auth/users
 * Matches backend `ListUsersRto` in common/rto/auth/list-users.rto.ts
 */
export interface ListUsersRto {
  items: UserRto[];
}

/**
 * Request body for POST /auth/register
 */
export interface RegisterUserRequest {
  email: string;
  password: string;
}

/**
 * Request body for POST /auth/login
 */
export interface LoginUserRequest {
  email: string;
  password: string;
}
