import { createFileRoute, redirect } from "@tanstack/react-router";
import { checkAuthenticated } from "./__root";

export const Route = createFileRoute("/")({
    beforeLoad: async ({ location }) => {
        await checkAuthenticated(location.href);
        throw redirect({ to: "/queues" });
    },
});
