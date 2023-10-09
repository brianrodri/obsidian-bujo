import { optimizeLodashImports } from "@optimize-lodash/rollup-plugin";
import { resolve } from "path";
import { defineConfig, normalizePath } from "vite";
import { default as tsconfigPaths } from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
    plugins: [optimizeLodashImports(), tsconfigPaths()],
    build: {
        copyPublicDir: true, // Copies manifest.json and version.json into the build directory.
        emptyOutDir: false, // Otherwise helpful files like ".hotreload" will be wiped.
        lib: {
            entry: normalizePath(resolve(__dirname, "src/main.ts")),
            fileName: () => "main.js", // vite will append ".cjs" without this indirection.
            formats: ["cjs"],
        },
        rollupOptions: {
            treeshake: true,
            external: ["obsidian"],
        },
        sourcemap: mode === "development" ? "inline" : false,
    },
    test: {
        coverage: {
            100: true,
            all: true,
            include: ["src"],
            exclude: ["src/main.ts"], // TODO: Figure out how to compile "obsidian" so I can test this file.
            provider: "istanbul", // v8 treats type definitions as untested code.
        },
        environment: "jsdom",
        watch: false, // must be enabled via CLI flags.
    },
}));
