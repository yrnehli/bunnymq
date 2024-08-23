import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import { QueueSkeleton } from "@/components/skeletons/QueueSkeleton";
import { checkAuthenticated } from "@/routes/__root";
import { QueueControl } from "@/routes/queues/$id/-QueueControl";

const queueSearchSchema = z.object({
    code: z.string().optional(),
});

export const Route = createFileRoute("/queues/$id/")({
    component: Queue,
    validateSearch: (search: Record<string, unknown>) => {
        return queueSearchSchema.parse(search);
    },
    beforeLoad: async ({ location }) => await checkAuthenticated(location.href),
});

function Queue() {
    return (
        <Suspense fallback={<QueueSkeleton />}>
            <QueueControl />
        </Suspense>
    );
}
