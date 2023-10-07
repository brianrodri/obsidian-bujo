import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        environment: "jsdom",
        coverage: {
            lines: 100,
            statements: 100,
            branches: 100,
            functions: 100,
        },
        watch: false,
    },
});
