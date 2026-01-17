/**
 * Standard error shape returned by NestJS/gateway on validation or HTTP errors.
 * The `message` can be a string or an array of validation messages.
 */
export interface GatewayErrorResponse {
  message?: string | string[];
  statusCode?: number;
  error?: string;
}

/**
 * Parsed API error with a normalized single message.
 */
export interface ApiError {
  message: string;
  statusCode: number;
}

/**
 * Normalizes the gateway error response into a single user-friendly message.
 */
export function parseGatewayError(response: GatewayErrorResponse): string {
  if (Array.isArray(response.message)) {
    return response.message.join(". ");
  }
  if (typeof response.message === "string") {
    return response.message;
  }
  if (response.error) {
    return response.error;
  }
  return "An unexpected error occurred";
}
