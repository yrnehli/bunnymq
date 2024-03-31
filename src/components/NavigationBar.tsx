import { Ping } from "@/components/Ping";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useOverflowDetector } from "react-detectable-overflow";

export function NavigationBar() {
    const loggedIn = sessionStorage.getItem("credentials") !== null;
    const environment = sessionStorage.getItem("environment");

    return (
        <nav className="flex items-center justify-between border-b p-2">
            <div className="flex flex-row items-center gap-x-5">
                <div className="ms-3 select-none text-nowrap">BunnyMQ 🐇</div>
                <Breadcrumbs />
            </div>
            <div className="flex flex-row">
                {loggedIn && environment && (
                    <div className="mx-3 flex flex-row items-center gap-x-2">
                        <Ping variant="green" />
                        <small className="font-medium">{environment}</small>
                    </div>
                )}
                <ThemeToggle />
                {loggedIn && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link to="/logout">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="focus-visible:ring-transparent"
                                    >
                                        <LogOut className="h-[1.2rem] w-[1.2rem]" />
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>Logout</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        </nav>
    );
}

function Breadcrumbs() {
    const router = useRouterState();
    const routeFragments = router.location.pathname.split("/").filter(Boolean);
    const { ref, overflow } = useOverflowDetector({});

    if (routeFragments.length < 2) {
        return false;
    }

    const breadcrumbs = routeFragments.map((fragment, i) => ({
        title: fragment,
        path: "/" + routeFragments.slice(0, i + 1).join("/"),
    }));

    return (
        <Breadcrumb
            className={cn(
                "hidden h-[20px] overflow-clip sm:block",
                overflow && "opacity-0",
            )}
            ref={ref}
        >
            <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, i) => {
                    const last = i + 1 === breadcrumbs.length;

                    return (
                        <div
                            className="flex items-center gap-x-2"
                            key={breadcrumb.path}
                        >
                            <BreadcrumbItem>
                                {!last ? (
                                    <BreadcrumbLink
                                        to={breadcrumb.path}
                                        className="capitalize"
                                    >
                                        {breadcrumb.title}
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>
                                        {breadcrumb.title}
                                    </BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                            {!last && <BreadcrumbSeparator />}
                        </div>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}