import * as structuredClone from "@ungap/structured-clone";

export default {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleDirectories: ["node_modules", "src"],
    globals: {
        structuredClone: structuredClone.default,
    },
} as import("jest").Config;
