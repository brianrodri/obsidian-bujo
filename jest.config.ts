import * as structuredClone from "@ungap/structured-clone";

export default {
    preset: "ts-jest",
    coverageThreshold: {
        global: {
            lines: 100,
            statements: 100,
            branches: 100,
            functions: 100,
        },
    },
    collectCoverageFrom: ["src/**/*.ts", "!src/main.ts"],
    testEnvironment: "jsdom",
    moduleDirectories: ["node_modules", "src"],
    globals: {
        structuredClone: structuredClone.default,
    },
} as import("jest").Config;
