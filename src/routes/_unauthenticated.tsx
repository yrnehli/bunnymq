import { createFileRoute, Outlet } from "@tanstack/react-router";
import React from "react";
import { Layout } from "@/components/Layout";
import { NavigationBar } from "@/components/NavigationBar";

export const Route = createFileRoute("/_unauthenticated")({
  component: Unauthenticated,
});

function Unauthenticated() {
  return (
    <React.Fragment>
      <NavigationBar loggedIn={false} />
      <Layout>
        <Outlet />
      </Layout>
    </React.Fragment>
  );
}
