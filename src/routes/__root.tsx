import { NavigationBar } from "@/components/NavigationBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { isAuthenticated } from "@/lib/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute, redirect } from "@tanstack/react-router";

const queryClient = new QueryClient();

export const Route = createRootRoute({
    component: () => (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <NavigationBar />
                <main className="mx-8 my-8 md:mx-16 lg:mx-32 xl:mx-48 2xl:mx-64">
                    <Outlet />
                </main>
                <Toaster />
            </ThemeProvider>
        </QueryClientProvider>
    ),
});

export async function checkAuthenticated(redirectTo: string) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        throw redirect({
            to: "/login",
            search: { next: redirectTo },
        });
    }
}