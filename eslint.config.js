import js from "@eslint/js";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptPluginParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import tsdocPlugin from "eslint-plugin-tsdoc";
import globals from "globals";

/** @type { import("eslint").Linter.FlatConfig } */
const GLOBAL_IGNORE = { ignores: ["test-vault/", "dist/", "docs/"] };

/** @exports so "eslint.build.config.js" can use the same targets. */
export const TYPESCRIPT_GLOB = "**/*.{,c,m}ts{,x}";

const JAVASCRIPT_GLOB = "**/*.{,c,m}js{,x}";

/** @type { import("eslint").Linter.FlatConfig } */
const globalsConfig = {
    files: [TYPESCRIPT_GLOB, JAVASCRIPT_GLOB],
    languageOptions: {
        globals: { ...globals.browser, ...globals.es5, ...globals.node },
    },
};

/** @type { import("eslint").Linter.FlatConfig } */
const prettierPluginConfig = {
    plugins: { prettier: prettierPlugin },
    rules: { ...prettierConfig.rules, "prettier/prettier": "error" },
};

/**
 * Depends on: {@link globalsConfig}
 * @type { import("eslint").Linter.FlatConfig }
 * @exports so TSDoc links work in "eslint.build.config.js".
 */
export const typescriptPluginConfigs = [
    {
        plugins: { "@typescript-eslint": typescriptPlugin },
        files: [TYPESCRIPT_GLOB],
        languageOptions: {
            parser: typescriptPluginParser,
            parserOptions: {
                ecmaFeatures: { modules: true },
                ecmaVersion: "latest",
                project: "./tsconfig.json",
            },
        },
        rules: {
            ...typescriptPlugin.configs.recommended.rules,
            ...typescriptPlugin.configs.strict.rules,
        },
    },
    {
        plugins: { tsdoc: tsdocPlugin },
        files: [TYPESCRIPT_GLOB],
        rules: { "tsdoc/syntax": "error" },
    },
];

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [GLOBAL_IGNORE, js.configs.recommended, globalsConfig, ...typescriptPluginConfigs, prettierPluginConfig];
