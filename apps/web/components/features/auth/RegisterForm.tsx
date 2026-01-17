"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, InputField, Modal, Card, CardContent } from "@/components/ui";
import { registerUser } from "@/lib/api/auth";
import { GatewayApiError } from "@/lib/api/gatewayClient";
import type { UserRto } from "@/types/api/auth";

type FormStatus = "idle" | "loading" | "success" | "error";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [createdUser, setCreatedUser] = useState<UserRto | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const response = await registerUser({ email, password });
      setCreatedUser(response.user);
      setStatus("success");
      setShowSuccessModal(true);
      // Clear form
      setEmail("");
      setPassword("");
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

  return (
    <>
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
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              helpText="Must be at least 8 characters"
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
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Account created!"
        description="Your account has been successfully created."
        size="sm"
      >
        {createdUser && (
          <div className="space-y-4">
            <div className="rounded-lg border border-brand-200 bg-brand-50 p-4 dark:border-brand-400/30 dark:bg-brand-400/10">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <span className="font-medium text-neutral-900 dark:text-neutral-100">Email:</span>{" "}
                {createdUser.email}
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowSuccessModal(false)} fullWidth>
                Close
              </Button>
              <Link href="/login" className="flex-1">
                <Button fullWidth>Sign in now</Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
