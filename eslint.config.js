import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import js from "@eslint/js";
import typescriptParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import tsdocPlugin from "eslint-plugin-tsdoc";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
    { ignores: ["docs/", "test-vault/"] },
    js.configs.recommended,
    {
        files: ["**/*.{cjs,js,mjs,ts}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es5,
            },
        },
    },
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaFeatures: { modules: true },
                ecmaVersion: "latest",
                project: "./tsconfig.json",
            },
        },
        plugins: {
            "@typescript-eslint": typescriptPlugin,
            import: importPlugin,
            tsdoc: tsdocPlugin,
        },
        settings: {
            ...importPlugin.configs.typescript.settings,
            "import/resolver": {
                node: true,
                typescript: true,
            },
        },
        rules: {
            ...typescriptPlugin.configs.recommended.rules,
            ...typescriptPlugin.configs.strict.rules,
            ...importPlugin.configs.recommended.rules,
            ...importPlugin.configs.typescript.rules,
            // https://typescript-eslint.io/linting/troubleshooting/performance-troubleshooting/#eslint-plugin-import
            "import/named": "off",
            "import/namespace": "off",
            "import/default": "off",
            "import/no-named-as-default-member": "off",
        },
    },
    {
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            ...prettierConfig.rules,
            "prettier/prettier": "error",
        },
    },
];
