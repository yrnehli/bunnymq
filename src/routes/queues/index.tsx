import { QueuesTable } from "@/components/QueuesTable";
import { RefreshButton } from "@/components/RefreshButton";
import { checkAuthenticated } from "@/routes/__root";
import { Updater, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SortingState, VisibilityState } from "@tanstack/react-table";
import { useState } from "react";
import { z } from "zod";

type QueuesSearch = {
    sorting?: SortingState;
    columnVisibility?: VisibilityState;
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
    const queryKey = ["queues", sessionStorage.getItem("environment")];
    const [refresh, setRefresh] = useState(false); // TODO: remove?

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
        });
    };

    return (
        <>
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">Queues 🧑‍💻</h1>
                <RefreshButton
                    onClick={() => {
                        queryClient.removeQueries({ queryKey });
                        setRefresh(!refresh);
                    }}
                />
            </div>
            <QueuesTable
                queryKey={queryKey}
                onColumnVisibilityChange={onColumnVisibilityChange}
                sorting={search.sorting}
                onSortingChange={onSortingChange}
            />
        </>
    );
}