import importPlugin from "eslint-plugin-import";
import * as baseConfig from "./eslint.config.js";

/**
 * Depends on {@link baseConfig.typescriptPluginConfigs}
 *
 * @type { import("eslint").Linter.FlatConfig }
 */
const mixinTypescriptImportPluginConfig = {
    files: [baseConfig.TYPESCRIPT_GLOB],
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
        // See: https://typescript-eslint.io/linting/troubleshooting/performance-troubleshooting/#eslint-plugin-import.
        "import/named": "off",
        "import/namespace": "off",
        "import/default": "off",
        "import/no-named-as-default-member": "off",
    },
};

export default [...baseConfig.default, mixinTypescriptImportPluginConfig];
