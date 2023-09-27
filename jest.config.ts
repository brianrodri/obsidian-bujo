import * as structuredClone from "@ungap/structured-clone";

export default {
    preset: "ts-jest",
    collectCoverageFrom: ["src/**/*.ts", "!src/main.ts"],
    testEnvironment: "jsdom",
    moduleDirectories: ["node_modules", "src"],
    globals: {
        structuredClone: structuredClone.default,
    },
} as import("jest").Config;
