import type { ErrorCode } from "./error-codes";

export interface ServiceError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

