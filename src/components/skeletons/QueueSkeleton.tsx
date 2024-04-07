import { Skeleton } from '@/components/ui/skeleton';

export function QueueSkeleton() {
    return (
        <div className="flex flex-col gap-y-2 py-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="mb-3 h-5 w-[max(500px,100%)] max-w-full" />
            <Skeleton className="h-96 w-full" />
        </div>
    );
}
