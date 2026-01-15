import { Skeleton } from "./Skeleton"

export function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm dark:bg-zinc-900">
      <Skeleton className="aspect-video w-full" />
      <div className="flex flex-1 flex-col p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
        <Skeleton className="mt-4 h-5 w-1/3" />
      </div>
    </div>
  )
}
