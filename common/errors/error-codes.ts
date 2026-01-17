export const ERROR_CODES = {
  USER_EMAIL_EXISTS: "USER_EMAIL_EXISTS",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

