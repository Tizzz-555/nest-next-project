const TOKEN_KEY = "access_token";

/**
 * Store the access token in localStorage.
 */
export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Retrieve the access token from localStorage.
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Remove the access token from localStorage.
 */
export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Check if user has an access token stored.
 */
export function hasAccessToken(): boolean {
  return getAccessToken() !== null;
}
