import { resolve } from "path";
import { defineConfig, normalizePath } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
    plugins: [preact()],
    build: {
        emptyOutDir: false, // Otherwise helpful files like ".hotreload" will be wiped.
        lib: {
            entry: normalizePath(resolve(__dirname, "src/main.ts")),
            fileName: () => "main.js", // vite will append ".cjs" without this indirection.
            formats: ["cjs"],
        },
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
