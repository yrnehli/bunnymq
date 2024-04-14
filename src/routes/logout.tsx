import { createFileRoute, redirect } from "@tanstack/react-router";
import { unauthenticate } from "@/lib/auth";

export const Route = createFileRoute("/logout")({
    beforeLoad: () => {
        unauthenticate();
        throw redirect({ to: "/login" });
    },
});
