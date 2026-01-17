import { type GatewayErrorResponse, parseGatewayError, type ApiError } from "@/types/api/errors";

const GATEWAY_BASE_URL =
  process.env.NEXT_PUBLIC_GATEWAY_BASE_URL || "http://localhost:3000";

/**
 * Custom error class for API errors with status code.
 */
export class GatewayApiError extends Error implements ApiError {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "GatewayApiError";
    this.statusCode = statusCode;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Generic fetch wrapper for gateway requests with consistent error handling.
 * Returns parsed JSON on success; throws GatewayApiError on failure.
 */
export async function gatewayFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const url = `${GATEWAY_BASE_URL}${endpoint}`;
  const fetchHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  const response = await fetch(url, {
    method,
    headers: fetchHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Try to parse JSON regardless of success/failure
  let data: T | GatewayErrorResponse;
  try {
    data = await response.json();
  } catch {
    // Non-JSON response
    if (!response.ok) {
      throw new GatewayApiError(response.statusText || "Request failed", response.status);
    }
    // Successful response with no body
    return undefined as T;
  }

  if (!response.ok) {
    const errorData = data as GatewayErrorResponse;
    const message = parseGatewayError(errorData);
    throw new GatewayApiError(message, response.status);
  }

  return data as T;
}
