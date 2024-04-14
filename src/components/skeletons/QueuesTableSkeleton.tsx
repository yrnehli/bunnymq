import { Skeleton } from "@/components/ui/skeleton";

export function QueueTablesSkeleton() {
    return (
        <div className="flex flex-col gap-y-2 py-4">
            <Skeleton className="mb-3 h-10 w-96" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
    );
}
