"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, InputField, Card, CardContent } from "@/components/ui";
import { loginUser } from "@/lib/api/auth";
import { setAccessToken } from "@/lib/auth/tokenStorage";
import { GatewayApiError } from "@/lib/api/gatewayClient";
import type { UserRto } from "@/types/api/auth";

type FormStatus = "idle" | "loading" | "success" | "error";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<UserRto | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const response = await loginUser({ email, password });
      // Store token
      setAccessToken(response.accessToken);
      setLoggedInUser(response.user);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      if (err instanceof GatewayApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  // Success state - show logged-in message with navigation
  if (isSuccess && loggedInUser) {
    return (
      <Card variant="elevated">
        <CardContent>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-400/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-brand-600 dark:text-brand-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Welcome back!
            </h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Signed in as <strong className="text-brand-600 dark:text-brand-400">{loggedInUser.email}</strong>
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <Link href="/users">
              <Button fullWidth>View all users</Button>
            </Link>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setStatus("idle");
                setLoggedInUser(null);
                setEmail("");
                setPassword("");
              }}
            >
              Sign in as different user
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Email address"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          {status === "error" && error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
            >
              {error}
            </div>
          )}

          <Button type="submit" fullWidth isLoading={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
