const commonjsPlugin = require("@rollup/plugin-commonjs");
const nodeResolvePlugin = require("@rollup/plugin-node-resolve");
const typescript2Plugin = require("rollup-plugin-typescript2");
const webWorkerLoaderPlugin = require("rollup-plugin-web-worker-loader");

/** @type { import("rollup").RollupOptions } */
export default {
    input: "src/main.ts",
    output: { sourcemap: "inline", format: "cjs", exports: "default" },
    external: ["obsidian", "@codemirror/view", "@codemirror/state", "@codemirror/language"],
    plugins: [
        commonjsPlugin(),
        nodeResolvePlugin({ browser: true }),
        typescript2Plugin(),
        webWorkerLoaderPlugin({ inline: true, forceInline: true, targetPlatform: "browser" }),
    ],
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
