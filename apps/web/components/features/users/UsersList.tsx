"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button, Card, CardContent } from "@/components/ui";
import { listUsers } from "@/lib/api/auth";
import { clearAccessToken, hasAccessToken } from "@/lib/auth/tokenStorage";
import { GatewayApiError } from "@/lib/api/gatewayClient";
import type { UserRto } from "@/types/api/auth";

type FetchStatus = "idle" | "loading" | "success" | "error";

export function UsersList() {
  const [users, setUsers] = useState<UserRto[]>([]);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const handleLogout = () => {
    clearAccessToken();
    setUsers([]);
    fetchUsers();
  };

  const fetchUsers = useCallback(async () => {
    // Check if we have a token before making the request
    if (!hasAccessToken()) {
      setIsUnauthorized(true);
      setStatus("error");
      setError("Please sign in to view users.");
      return;
    }

    setStatus("loading");
    setError(null);
    setIsUnauthorized(false);

    try {
      const response = await listUsers();
      setUsers(response.items);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      if (err instanceof GatewayApiError) {
        if (err.statusCode === 401) {
          clearAccessToken();
          setIsUnauthorized(true);
          setError("Your session has expired. Please sign in again.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Failed to load users. Please try again.");
      }
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Loading state
  if (status === "loading" || status === "idle") {
    return (
      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="h-8 w-8 animate-spin text-brand-600 dark:text-brand-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">Loading users...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Unauthorized error state
  if (status === "error" && isUnauthorized) {
    return (
      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-400/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-brand-600 dark:text-brand-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Authentication required
            </h3>
            <p className="mt-1 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">{error}</p>
            <Link href="/login" className="mt-6">
              <Button>Sign in</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // General error state
  if (status === "error" && error) {
    return (
      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Something went wrong
            </h3>
            <p className="mt-1 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">{error}</p>
            <Button variant="secondary" className="mt-6" onClick={fetchUsers}>
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (users.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-neutral-500 dark:text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              No users yet
            </h3>
            <p className="mt-1 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
              Be the first to create an account!
            </p>
            <Link href="/register" className="mt-6">
              <Button>Create account</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success state with users
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {users.length} user{users.length !== 1 ? "s" : ""} found
        </p>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchUsers}>
            Refresh
          </Button>
          {hasAccessToken() && (
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {users.map((user) => (
          <Card key={user.id} variant="default">
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 dark:bg-brand-400/20 dark:text-brand-400">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-neutral-900 dark:text-neutral-100">
                    {user.email}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    Joined {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return isoString;
  }
}
