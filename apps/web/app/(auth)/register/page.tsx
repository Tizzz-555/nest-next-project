import { RegisterForm } from "@/components/features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Create an account</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Enter your details below to get started
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
