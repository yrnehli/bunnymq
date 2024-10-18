import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CatchBoundary, Outlet, createRootRoute } from "@tanstack/react-router";
import { ErrorPage } from "@/components/ErrorPage";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient({
    defaultOptions: { queries: { throwOnError: true } },
});

export const Route = createRootRoute({
    component: () => (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <CatchBoundary
                    getResetKey={() => "reset"}
                    // eslint-disable-next-line no-console
                    onCatch={(error) => console.error(error)}
                    errorComponent={ErrorPage}
                >
                    <Outlet />
                    <Toaster />
                </CatchBoundary>
            </ThemeProvider>
        </QueryClientProvider>
    ),
});
