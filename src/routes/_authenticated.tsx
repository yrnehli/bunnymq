import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import React from "react";
import { Layout } from "@/components/Layout";
import { NavigationBar } from "@/components/NavigationBar";
import { environmentNameSchema } from "@/config";
import { isAuthenticated } from "@/lib/auth";
import { getCookie } from "@/lib/cookies";

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
  component: Authenticated,
});

function Authenticated() {
  const environment = getCookie("environment");

  return (
    <React.Fragment>
      <NavigationBar
        loggedIn={true}
        environment={environmentNameSchema.parse(environment)}
      />
      <Layout>
        <Outlet />
      </Layout>
    </React.Fragment>
  );
}
