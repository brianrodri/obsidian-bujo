const commonjsPlugin = require("@rollup/plugin-commonjs");
const nodeResolvePlugin = require("@rollup/plugin-node-resolve");
const typescriptPlugin = require("rollup-plugin-typescript2");
const webWorkerPlugin = require("rollup-plugin-web-worker-loader");

/** @type { import("rollup").Plugin[] } */
const basePlugins = [
    typescriptPlugin(),
    nodeResolvePlugin({ browser: true }),
    commonjsPlugin(),
    webWorkerPlugin({ inline: true, forceInline: true, targetPlatform: "browser" }),
];

export default {
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
    output: {
        sourcemap: "inline",
        format: "cjs",
        exports: "default",
    },
    plugins: [...basePlugins],
};
