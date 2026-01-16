export const ERROR_CODES = {
  USER_EMAIL_EXISTS: "USER_EMAIL_EXISTS",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

