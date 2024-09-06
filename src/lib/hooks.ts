import {
    QueryFunction,
    QueryKey,
    useQueryClient,
    useSuspenseQuery,
} from "@tanstack/react-query";
import { messages, queue, queues } from "@/lib/api";

function useSuspenseQueryWithInvalidator<
    T = unknown,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = never,
>(queryKey: TQueryKey, queryFn: QueryFunction<T, TQueryKey, TPageParam>) {
    const queryClient = useQueryClient();

    const query = useSuspenseQuery({
        queryKey,
        queryFn,
    });

    return {
        ...query,
        queryKey,
        invalidate: () => {
            return queryClient.invalidateQueries({
                queryKey,
            });
        },
    };
}

export function useQueues() {
    return useSuspenseQueryWithInvalidator(["queue"], () => queues());
}

export function useQueue(id: string) {
    return useSuspenseQueryWithInvalidator(["queue", id], () => queue(id));
}

export function useQueueMessages(queueId: string) {
    return useSuspenseQueryWithInvalidator(["messages", queueId], () =>
        messages(queueId),
    );
}
