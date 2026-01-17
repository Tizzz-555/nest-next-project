"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  error?: string;
  helpText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-4 py-3 text-lg",
};

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      error,
      helpText,
      leftIcon,
      rightIcon,
      size = "md",
      fullWidth = true,
      disabled,
      required,
      id: providedId,
      className = "",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = providedId || generatedId;
    const errorId = `${inputId}-error`;
    const helpId = `${inputId}-help`;

    const hasError = Boolean(error);

    // Build aria-describedby based on what text is present
    const describedBy = [
      hasError ? errorId : null,
      helpText && !hasError ? helpId : null,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500 dark:text-red-400" aria-hidden="true">
              *
            </span>
          )}
        </label>

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 dark:text-neutral-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={describedBy || undefined}
            className={`
              block rounded-lg border bg-white text-neutral-900
              transition-all duration-200
              placeholder:text-neutral-400
              focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:ring-offset-0 focus:border-brand-500
              disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:opacity-50
              dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500
              dark:disabled:bg-neutral-950
              ${sizeStyles[size]}
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              ${fullWidth ? "w-full" : ""}
              ${
                hasError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                  : "border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-600"
              }
              ${className}
            `}
            {...props}
          />

          {rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500 dark:text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>

        {hasError && (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}

        {helpText && !hasError && (
          <p id={helpId} className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
