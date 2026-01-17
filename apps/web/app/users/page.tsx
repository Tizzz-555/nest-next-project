import { UsersList } from "@/components/features/users/UsersList";

export default function UsersPage() {
  return (
    <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Users</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Browse all registered users in the system
          </p>
        </div>
        <UsersList />
      </div>
    </div>
  );
}
