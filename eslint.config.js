import js from "@eslint/js";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptPluginParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import tsdocPlugin from "eslint-plugin-tsdoc";
import globals from "globals";

export const TYPESCRIPT_GLOB = "**/*.{ts,tsx}";

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
    // Don't lint files under these directories.
    { ignores: ["test-vault/", "dist/", "docs/"] },

    js.configs.recommended,

    // ESLint needs to know that the *.config.js files run in a NodeJS environment.
    {
        files: ["*.config.js"],
        languageOptions: { globals: globals.node },
    },

    // Configure the TypeScript source code.
    {
        plugins: { "@typescript-eslint": typescriptPlugin },
        files: [TYPESCRIPT_GLOB],
        languageOptions: {
            globals: globals.browser, // Source code is designed to run in a browser context.
            parser: typescriptPluginParser,
            parserOptions: {
                ecmaFeatures: { modules: true },
                ecmaVersion: "latest",
            },
        },
        rules: {
            ...typescriptPlugin.configs.recommended.rules,
            ...typescriptPlugin.configs.strict.rules,
        },
    },

    // Configure plugin for validating TSDoc annotations on TypeScript files.
    {
        plugins: { tsdoc: tsdocPlugin },
        files: [TYPESCRIPT_GLOB],
        rules: { "tsdoc/syntax": "error" },
    },

    // Configure prettier to run on all files.
    {
        plugins: { prettier: prettierPlugin },
        files: ["**/*"],
        rules: {
            ...prettierConfig.rules, // Disables eslint rules that conflict with Prettier.
            "prettier/prettier": "error",
        },
    },
];
