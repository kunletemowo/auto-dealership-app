import Link from "next/link";
import { Button } from "@/components/forms/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          404
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Page not found
        </p>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
