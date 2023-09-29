/** @type { import("jest").Config } */
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
    collectCoverageFrom: ["src/**/*.ts"],
    coveragePathIgnorePatterns: ["src/main.ts"],
    testEnvironment: "jsdom",
    moduleDirectories: ["node_modules", "src"],
};
