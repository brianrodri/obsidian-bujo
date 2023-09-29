const { optimizeLodashImports: optimizeLodashImportsPlugin } = require("@optimize-lodash/rollup-plugin");
const copyPlugin = require("rollup-plugin-copy");
import baseConfig from "./rollup.config.base.js";

const BUILD_DIR = "dist/";

export default {
    input: baseConfig.input,
    external: baseConfig.external,
    onwarn: baseConfig.onwarn,
    output: {
        ...baseConfig.output,
        dir: BUILD_DIR,
        sourcemapExcludeSources: true,
    },
    plugins: [
        ...baseConfig.plugins,
        optimizeLodashImportsPlugin(),
        copyPlugin({
            targets: [
                { src: "manifest.json", dest: BUILD_DIR },
                { src: "README.md", dest: BUILD_DIR },
            ],
        }),
    ],
};
