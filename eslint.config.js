import js from "@eslint/js";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptPluginParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import tsdocPlugin from "eslint-plugin-tsdoc";
import globals from "globals";

export const TYPESCRIPT_FILES = ["src/**/*.ts"];

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

    // Configure the source code.
    {
        plugins: { "@typescript-eslint": typescriptPlugin },
        files: TYPESCRIPT_FILES,
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
        files: TYPESCRIPT_FILES,
        rules: { "tsdoc/syntax": "error" },
    },

    // Configure prettier to run on all files.
    {
        plugins: { prettier: prettierPlugin },
        // NOTE: Omitting `files` is the same as selecting all files.
        rules: {
            ...prettierConfig.rules, // Updates rules that conflict with Prettier.
            "prettier/prettier": "error",
        },
    },
];
