import {
    RouterProvider,
    createRouter,
    useNavigate,
} from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "@/globals.css";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
    routeTree,
    defaultNotFoundComponent: () => {
        const navigate = useNavigate();
        navigate({ to: "/" });
    },
    basepath: "/bunnymq",
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <RouterProvider router={router} />
        </StrictMode>,
    );
}
