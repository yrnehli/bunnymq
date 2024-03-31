import { isAuthenticated } from "@/lib/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    beforeLoad: async () => {
        const authenticated = await isAuthenticated();
        if (authenticated) {
            throw redirect({ to: "/queues" });
        }

        throw redirect({
            to: "/login",
            search: {
                next: "/",
            },
        });
    },
});
