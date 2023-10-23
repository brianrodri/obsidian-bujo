import preact from "@preact/preset-vite";
import { resolve } from "path";
import { defineConfig, normalizePath } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
    plugins: [nodePolyfills({ include: ["assert", "path"] }), preact()],
    build: {
        emptyOutDir: false, // Otherwise helpful files like ".hotreload" will be wiped.
        lib: {
            entry: normalizePath(resolve(__dirname, "src/main.tsx")),
            fileName: () => "main.js", // vite will append ".cjs" without this indirection.
            formats: ["cjs"],
        },
        rollupOptions: { external: ["obsidian"] },
    },
    test: {
        coverage: {
            statements: 100,
            branches: 90, // TODO: Preact reduces coverage of import statements. Figure out why.
            functions: 100,
            lines: 100,
            include: ["src"],
            provider: "istanbul",
        },
        environment: "jsdom",
    },
});
