import { Skeleton } from "@/components/ui/Skeleton"

export default function SavedListingsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm dark:bg-zinc-900">
            <Skeleton className="aspect-video w-full" />
            <div className="flex flex-1 flex-col p-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
              <Skeleton className="mt-4 h-5 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
