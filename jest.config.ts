import type { Config } from "jest";

const config: Config = {
    modulePaths: ["<rootDir>/src"],
    preset: "ts-jest",
    testEnvironment: "node",
};

export default config;
