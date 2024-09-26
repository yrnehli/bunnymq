import { Updater } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SortingState, VisibilityState } from "@tanstack/react-table";
import { Suspense } from "react";
import { z } from "zod";
import { Queues } from "@/routes/_authenticated/queues/-components/Queues";
import { QueuesSkeleton } from "@/routes/_authenticated/queues/-components/QueuesSkeleton";

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

export const Route = createFileRoute("/_authenticated/queues/")({
    component: QueuesLoader,
    validateSearch: (search: Record<string, unknown>) => {
        return queuesSearchSchema.parse(search);
    },
});

function QueuesLoader() {
    const search = Route.useSearch();
    const navigate = useNavigate();

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
        <Suspense fallback={<QueuesSkeleton />}>
            <Queues
                searchTerm={search.searchTerm}
                columnVisibility={search.columnVisibility ?? {}}
                onColumnVisibilityChange={onColumnVisibilityChange}
                sorting={search.sorting ?? []}
                onSortingChange={onSortingChange}
                onSearchTermChange={onSearchTermChange}
            />
        </Suspense>
    );
}
