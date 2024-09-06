import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import { checkAuthenticated } from "@/routes/__root";
import { Queue } from "@/routes/queues/$id/-components/Queue";
import { QueueSkeleton } from "@/routes/queues/$id/-components/QueueSkeleton";

const queueSearchSchema = z.object({
    code: z.string().optional(),
});

export const Route = createFileRoute("/queues/$id/")({
    component: QueueLoader,
    validateSearch: (search: Record<string, unknown>) => {
        return queueSearchSchema.parse(search);
    },
    beforeLoad: async ({ location }) => await checkAuthenticated(location.href),
});

function QueueLoader() {
    return (
        <Suspense fallback={<QueueSkeleton />}>
            <Queue />
        </Suspense>
    );
}
