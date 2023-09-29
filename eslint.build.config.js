import importPlugin from "eslint-plugin-import";
import { flatConfig, TYPESCRIPT_GLOB } from "./eslint.config.js";

/**
 * Requires `typescriptPluginConfig` from eslint.config.js.
 *
 * @type { import("eslint").Linter.FlatConfig }
 */
const mixinTypescriptImportPluginConfig = {
    files: [TYPESCRIPT_GLOB],
    plugins: { import: importPlugin },
    settings: {
        ...importPlugin.configs.typescript.settings,
        "import/resolver": {
            node: true,
            typescript: true,
        },
    },
    rules: {
        ...importPlugin.configs.recommended.rules,
        ...importPlugin.configs.typescript.rules,
        // These rules are redundant because TypeScript already reports them as errors.
        "import/named": "off",
        "import/namespace": "off",
        "import/default": "off",
        "import/no-named-as-default-member": "off",
        // See: https://typescript-eslint.io/linting/troubleshooting/performance-troubleshooting/#eslint-plugin-import.
    },
};

export default [...flatConfig, mixinTypescriptImportPluginConfig];
