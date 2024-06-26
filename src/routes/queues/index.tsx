import { Updater, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SortingState, VisibilityState } from "@tanstack/react-table";
import { Suspense, useState } from "react";
import { z } from "zod";
import { QueuesTable } from "@/components/QueuesTable";
import { RefreshButton } from "@/components/RefreshButton";
import { QueueTablesSkeleton } from "@/components/skeletons/QueuesTableSkeleton";
import { getCookie } from "@/lib/cookies";
import { checkAuthenticated } from "@/routes/__root";

type QueuesSearch = {
    sorting?: SortingState;
    columnVisibility?: VisibilityState;
    searchTerm?: string;
};

const queuesSearchSchema: z.ZodType<QueuesSearch> = z.object({
    sorting: z
        .array(
            z.object({
                desc: z.boolean(),
                id: z.string(),
            }),
        )
        .optional(),
    columnVisibility: z.record(z.string(), z.boolean()).optional(),
    searchTerm: z.string().optional(),
});

export const Route = createFileRoute("/queues/")({
    component: Queues,
    validateSearch: (search: Record<string, unknown>) => {
        return queuesSearchSchema.parse(search);
    },
    beforeLoad: async ({ location }) => await checkAuthenticated(location.href),
});

function Queues() {
    const search = Route.useSearch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [fetching, setFetching] = useState(false);
    const environment = getCookie("environment");
    const queryKey = ["queues", environment];

    const onColumnVisibilityChange = (
        updateFn: Updater<VisibilityState, VisibilityState>,
    ) => {
        if (typeof updateFn !== "function") {
            return;
        }

        const res = updateFn(search.columnVisibility ?? {});
        void navigate({
            search: {
                ...search,
                columnVisibility: res,
            },
            replace: true,
        });
    };

    const onSortingChange = (updateFn: Updater<SortingState, SortingState>) => {
        if (typeof updateFn !== "function") {
            return;
        }

        const res = updateFn(search.sorting ?? []);
        void navigate({
            search: {
                ...search,
                sorting: res,
            },
            replace: true,
        });
    };

    const onSearchTermChange = (searchTerm: string) => {
        void navigate({
            search: {
                ...search,
                searchTerm,
            },
            replace: true,
        });
    };

    return (
        <>
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">Queues 🧑‍💻</h1>
                <RefreshButton
                    onClick={() => queryClient.invalidateQueries({ queryKey })}
                    disabled={fetching}
                />
            </div>
            <Suspense fallback={<QueueTablesSkeleton />}>
                <QueuesTable
                    queryKey={queryKey}
                    searchTerm={search.searchTerm}
                    columnVisibility={search.columnVisibility ?? {}}
                    onColumnVisibilityChange={onColumnVisibilityChange}
                    sorting={search.sorting ?? []}
                    onSortingChange={onSortingChange}
                    onFetchingChange={(isFetching) => setFetching(isFetching)}
                    onSearchTermChange={onSearchTermChange}
                />
            </Suspense>
        </>
    );
}
