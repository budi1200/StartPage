import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const isProduction = mode === "production";
    return {
        plugins: [tsconfigPaths(), svelte()],
        build: {
            minify: isProduction,
        },
    };
});
