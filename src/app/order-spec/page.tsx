import { SpecRequestForm } from "@/components/spec-requests/SpecRequestForm";
import { unstable_noStore } from "next/cache";

export default function OrderSpecPage() {
  unstable_noStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Order My Spec
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Tell us exactly what you're looking for. Fill out the form below with your
            car specifications, and we'll help you find the perfect match.
          </p>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <SpecRequestForm />
        </div>
      </div>
    </div>
  );
}
