import {defineConfig} from "vite";
import {svelte} from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  const isProduction = mode === "production";
  return {
    plugins: [svelte({})],
    build: {
      minify: isProduction,
    },
  };
});
