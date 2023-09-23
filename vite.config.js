import { defineConfig } from "vite";

export default defineConfig({
    test: {
        coverage: {
            all: true,
            include: ["src/**/*"],
            exclude: ["src/main.ts"],
        },
    },
});
