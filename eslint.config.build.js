import importPlugin from "eslint-plugin-import";
import { default as baseConfig, TYPESCRIPT_FILES } from "./eslint.config.js";

export default [
    ...baseConfig,

    // These plugins are too expensive for IDEs, so only run them in "build mode".
    {
        plugins: { import: importPlugin },
        files: TYPESCRIPT_FILES,
        settings: {
            ...importPlugin.configs.typescript.settings,
            "import/resolver": { typescript: true },
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
    },
];
