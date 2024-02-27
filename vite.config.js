import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tsconfigPaths from "vite-tsconfig-paths";
import Icons from "unplugin-icons/vite";

export default defineConfig(({ _, mode }) => {
    const isProduction = mode === "production";
    return {
        plugins: [
            tsconfigPaths(),
            svelte(),
            Icons({
                compiler: "svelte",
            }),
        ],
        build: {
            minify: isProduction,
        },
    };
});
