import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "outlined" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
}

const variantStyles = {
  default: "bg-white border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800",
  outlined: "bg-transparent border-2 border-neutral-300 dark:border-neutral-700",
  elevated:
    "bg-white shadow-lg shadow-neutral-200/50 border border-neutral-100 dark:bg-neutral-900 dark:shadow-black/50 dark:border-neutral-800",
};

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function Card({
  children,
  variant = "default",
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`
        rounded-xl transition-all duration-200
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
}

export function CardTitle({ children, as: Component = "h3", className = "" }: CardTitleProps) {
  return (
    <Component
      className={`text-lg font-semibold text-neutral-900 dark:text-neutral-100 ${className}`}
    >
      {children}
    </Component>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className = "" }: CardDescriptionProps) {
  return (
    <p className={`mt-1 text-sm text-neutral-500 dark:text-neutral-400 ${className}`}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={className}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div
      className={`mt-4 flex items-center gap-2 border-t border-neutral-200 pt-4 dark:border-neutral-800 ${className}`}
    >
      {children}
    </div>
  );
}
