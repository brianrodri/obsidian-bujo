const copyPlugin = require("rollup-plugin-copy");
import baseConfig from "./rollup.config.base.js";

const BUILD_DIR = "test-vault/.obsidian/plugins/obsidian-bujo/";

export default {
    input: baseConfig.input,
    external: baseConfig.external,
    onwarn: baseConfig.onwarn,
    output: {
        dir: BUILD_DIR,
        sourcemap: "inline",
        format: "cjs",
        exports: "default",
    },
    plugins: [
        ...baseConfig.plugins,
        copyPlugin({
            targets: [
                { src: "manifest.json", dest: BUILD_DIR },
                { src: "README.md", dest: BUILD_DIR },
            ],
        }),
    ],
};
