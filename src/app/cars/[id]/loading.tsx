import { Skeleton } from "@/components/ui/Skeleton"

export default function CarDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <Skeleton className="h-8 w-64" />
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <Skeleton className="aspect-video w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
