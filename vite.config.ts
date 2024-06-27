import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                "index": "./index.html",
                "icon-192": "./icon-192.png",
                "icon-512": "./icon-512.png",
            },
        },
    },
    plugins: [
        react(),
        checker({
            typescript: true,
        }),
        tsconfigPaths(),
        TanStackRouterVite(),
    ],
});
