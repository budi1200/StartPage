import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";

export default defineConfig(({ _, mode }) => {
    const isProduction = mode === "production";
    return {
        plugins: [
            svelte(),
            tailwindcss(),
            Icons({
                compiler: "svelte",
            }),
        ],
        resolve: {
            tsconfigPaths: true,
        },
        build: {
            minify: isProduction,
        },
    };
});
