import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import { Queue } from "@/routes/_authenticated/queues/$id/-components/Queue";
import { QueueSkeleton } from "@/routes/_authenticated/queues/$id/-components/QueueSkeleton";

const queueSearchSchema = z.object({
  code: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/queues/$id/")({
  component: QueueLoader,
  validateSearch: (search: Record<string, unknown>) => {
    return queueSearchSchema.parse(search);
  },
});

function QueueLoader() {
  return (
    <Suspense fallback={<QueueSkeleton />}>
      <Queue />
    </Suspense>
  );
}
