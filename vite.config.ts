import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/bunnymq/",
    build: {
        rollupOptions: {
            input: {
                "index": "./index.html",
                "404": "./404.html",
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
        VitePWA({
            manifest: {
                name: "BunnyMQ",
                icons: [
                    {
                        src: "/icon-192.png",
                        type: "image/png",
                        sizes: "192x192",
                    },
                    {
                        src: "/icon-512.png",
                        type: "image/png",
                        sizes: "512x512",
                    },
                ],
                start_url: "/bunnymq",
                display: "minimal-ui",
            },
        }),
    ],
});
