import { gatewayFetch } from "./gatewayClient";
import { getAccessToken } from "@/lib/auth/tokenStorage";
import type {
  RegisterUserRequest,
  RegisterUserRto,
  LoginUserRequest,
  LoginUserRto,
  ListUsersRto,
} from "@/types/api/auth";

/**
 * Register a new user via POST /auth/register.
 */
export async function registerUser(data: RegisterUserRequest): Promise<RegisterUserRto> {
  return gatewayFetch<RegisterUserRto>("/auth/register", {
    method: "POST",
    body: data,
  });
}

/**
 * Login and receive an access token via POST /auth/login.
 */
export async function loginUser(data: LoginUserRequest): Promise<LoginUserRto> {
  return gatewayFetch<LoginUserRto>("/auth/login", {
    method: "POST",
    body: data,
  });
}

/**
 * List all users via GET /auth/users.
 * Requires authentication - uses stored access token.
 */
export async function listUsers(): Promise<ListUsersRto> {
  const token = getAccessToken();
  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return gatewayFetch<ListUsersRto>("/auth/users", {
    method: "GET",
    headers,
  });
}
