const copyPlugin = require("rollup-plugin-copy");
import commonConfig from "./rollup.config.common.js";

const BUILD_DIR = "test-vault/.obsidian/plugins/obsidian-bujo/";

/** @type { import("rollup").RollupOptions } */
export default {
    ...commonConfig,
    output: { ...commonConfig.output, dir: BUILD_DIR },
    plugins: [
        ...commonConfig.plugins,
        copyPlugin({
            targets: [
                { src: "manifest.json", dest: BUILD_DIR },
                { src: "README.md", dest: BUILD_DIR },
            ],
        }),
    ],
};
