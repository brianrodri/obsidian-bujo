const { optimizeLodashImports: optimizeLodashImportsPlugin } = require("@optimize-lodash/rollup-plugin");
const commonjsPlugin = require("@rollup/plugin-commonjs");
const nodeResolvePlugin = require("@rollup/plugin-node-resolve");
const copyPlugin = require("rollup-plugin-copy");
const typescriptPlugin = require("rollup-plugin-typescript2");
const webWorkerPlugin = require("rollup-plugin-web-worker-loader");

/** @type { (dest: string) => import("rollup").Plugin } */
const copyPluginForExportingObsidianMetadataTo = dest =>
    copyPlugin({
        targets: [
            { src: "manifest.json", dest },
            { src: "styles.css", dest },
        ],
    });

/** @type { import("rollup").OutputOptions } */
const baseOutput = {
    sourcemap: "inline",
    format: "cjs",
    exports: "default",
};

/** @type { import("rollup").Plugin[] } */
const basePlugins = [
    typescriptPlugin(),
    nodeResolvePlugin({ browser: true }),
    commonjsPlugin(),
    webWorkerPlugin({ inline: true, forceInline: true, targetPlatform: "browser" }),
];

/** @type { import("rollup").RollupOptions } */
const baseOptions = {
    input: "src/main.ts",
    external: ["obsidian", "@codemirror/view", "@codemirror/state", "@codemirror/language"],
    onwarn: (warning, warn) => {
        if (
            warning.code === "CIRCULAR_DEPENDENCY" &&
            warning.cycle.every(module => module.startsWith("node_modules/luxon/"))
        ) {
            return; // NOTE(moment/luxon#193): Luxon's circular dependency won't be fixed any time soon, so just ignore it.
        }
        warn(warning);
    },
};

/** @type { import("rollup").RollupOptions } */
const devoOptions = {
    ...baseOptions,
    output: {
        ...baseOutput,
        dir: "test-vault/.obsidian/plugins/obsidian-bujo/",
    },
    plugins: [...basePlugins, copyPluginForExportingObsidianMetadataTo("test-vault/.obsidian/plugins/obsidian-bujo/")],
};

/** @type { import("rollup").RollupOptions } */
const prodOptions = {
    ...baseOptions,
    output: {
        ...baseOutput,
        dir: "dist",
        sourcemapExcludeSources: true,
    },
    plugins: [...basePlugins, optimizeLodashImportsPlugin(), copyPluginForExportingObsidianMetadataTo("dist/")],
};

export default [process.env.BUILD === "PROD" ? prodOptions : devoOptions];
