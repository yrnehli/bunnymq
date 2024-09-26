import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_unauthenticated/")({
    beforeLoad: () => {
        throw redirect({ to: "/queues" });
    },
});
