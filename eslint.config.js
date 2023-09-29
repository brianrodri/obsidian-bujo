import js from "@eslint/js";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptPluginParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import tsdocPlugin from "eslint-plugin-tsdoc";
import globals from "globals";

export const TYPESCRIPT_GLOB = "**/*.{,c,m}ts{,x}";
export const JAVASCRIPT_GLOB = "**/*.{,c,m}js{,x}";

/** @type { import("eslint").Linter.FlatConfig } */
export const globalsConfig = {
    files: [TYPESCRIPT_GLOB, JAVASCRIPT_GLOB],
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.es5,
            ...globals.node,
        },
    },
};

/** @type { import("eslint").Linter.FlatConfig } */
export const typescriptPluginConfig = {
    files: [TYPESCRIPT_GLOB],
    languageOptions: {
        parser: typescriptPluginParser,
        parserOptions: {
            ecmaFeatures: { modules: true },
            ecmaVersion: "latest",
            project: "./tsconfig.json",
        },
    },
    plugins: {
        "@typescript-eslint": typescriptPlugin,
    },
    rules: {
        ...typescriptPlugin.configs.recommended.rules,
        ...typescriptPlugin.configs.strict.rules,
    },
};

/** @type { import("eslint").Linter.FlatConfig } */
export const prettierPluginConfig = {
    plugins: {
        prettier: prettierPlugin,
    },
    rules: {
        ...prettierConfig.rules,
        "prettier/prettier": "error",
    },
};

/**
 * Requires {@link typescriptPluginConfig}.
 *
 * @type { import("eslint").Linter.FlatConfig }
 */
export const mixinTsdocPluginConfig = {
    files: [TYPESCRIPT_GLOB],
    plugins: { tsdoc: tsdocPlugin },
    rules: { "tsdoc/syntax": "error" },
};

/** @type { import("eslint").Linter.FlatConfig[] } */
export const flatConfig = [
    { ignores: ["docs/", "test-vault/"] },
    js.configs.recommended,
    globalsConfig,
    typescriptPluginConfig,
    mixinTsdocPluginConfig,
    prettierPluginConfig,
];

export default flatConfig;
