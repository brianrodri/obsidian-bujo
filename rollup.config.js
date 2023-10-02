const optimizeLodashImportsPlugin = require("@optimize-lodash/rollup-plugin").optimizeLodashImports;
const copyPlugin = require("rollup-plugin-copy");
import commonConfig from "./rollup.config.common.js";

const BUILD_DIR = "dist/";

/** @type { import("rollup").RollupOptions } */
export default {
    ...commonConfig,
    output: { ...commonConfig.output, dir: BUILD_DIR, sourcemapExcludeSources: true },
    plugins: [
        ...commonConfig.plugins,
        optimizeLodashImportsPlugin(),
        copyPlugin({
            targets: [
                { src: "manifest.json", dest: BUILD_DIR },
                { src: "README.md", dest: BUILD_DIR },
            ],
        }),
    ],
};
