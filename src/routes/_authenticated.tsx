import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
    beforeLoad: async ({ location }) => {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            throw redirect({
                to: "/login",
                search: { next: location.href },
            });
        }
    },
});
