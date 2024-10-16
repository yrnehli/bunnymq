import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CatchBoundary, Outlet, createRootRoute } from "@tanstack/react-router";
import { ErrorPage } from "@/components/ErrorPage";
import { NavigationBar } from "@/components/NavigationBar";
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
                    <NavigationBar />
                    <main className="mx-8 my-8 pb-24 md:mx-16 lg:mx-32 xl:mx-48 2xl:mx-64">
                        <Outlet />
                    </main>
                    <Toaster />
                </CatchBoundary>
            </ThemeProvider>
        </QueryClientProvider>
    ),
});
