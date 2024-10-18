import { createFileRoute, Outlet } from "@tanstack/react-router";
import React from "react";
import { NavigationBar } from "@/components/NavigationBar";

export const Route = createFileRoute("/_unauthenticated")({
    component: Unauthenticated,
});

function Unauthenticated() {
    return (
        <React.Fragment>
            <NavigationBar loggedIn={false} />
            <main className="mx-8 my-8 pb-24 md:mx-16 lg:mx-32 xl:mx-48 2xl:mx-64">
                <Outlet />
            </main>
        </React.Fragment>
    );
}
