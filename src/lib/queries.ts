import {
    DefaultError,
    QueryKey,
    useQueryClient,
    useSuspenseQuery,
    UseSuspenseQueryOptions,
} from "@tanstack/react-query";
import { messages, queue, queues } from "@/lib/api";

function useResource<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(options: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
    const queryClient = useQueryClient();
    const query = useSuspenseQuery(options);
    const { queryKey } = options;

    return {
        ...query,
        queryKey,
        resetQuery: () => queryClient.resetQueries({ queryKey }),
        invalidateQuery: () => {
            return queryClient.invalidateQueries({
                queryKey,
            });
        },
    };
}

export function useQueues() {
    return useResource({
        queryKey: ["queue"],
        queryFn: () => queues(),
    });
}

export function useQueue(id: string) {
    return useResource({
        queryKey: ["queue", id],
        queryFn: () => queue(id),
    });
}

export function useQueueMessages(queueId: string) {
    return useResource({
        queryKey: ["messages", queueId],
        queryFn: () => messages(queueId),
    });
}
