import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/logout")({
    beforeLoad: () => {
        sessionStorage.clear();
        throw redirect({ to: "/login" });
    },
});
