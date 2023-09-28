"use strict";
const { optimizeLodashImports } = require("@optimize-lodash/rollup-plugin");
const commonjs = require("@rollup/plugin-commonjs");
const eslint = require("@rollup/plugin-eslint");
const nodeResolve = require("@rollup/plugin-node-resolve");
const copy = require("rollup-plugin-copy");
const typescript2 = require("rollup-plugin-typescript2");
const webWorker = require("rollup-plugin-web-worker-loader");
const { sep } = require("path");

const DEFAULT_PLUGINS = [
    typescript2(),
    nodeResolve({ browser: true }),
    commonjs(),
    webWorker({ inline: true, forceInline: true, targetPlatform: "browser" }),
    eslint(),
];

const BASE_CONFIG = {
    input: "src/main.ts",
    external: ["obsidian", "@codemirror/view", "@codemirror/state", "@codemirror/language"],
    onwarn: (warning, warn) => {
        if (warning.code === "CIRCULAR_DEPENDENCY") {
            if (warning.cycle.every(id => id.startsWith(`node_modules${sep}luxon${sep}`))) {
                // TODO(moment/luxon#193): Luxon's circular dependency won't be fixed any time soon.
                return;
            }
        }
        warn(warning);
    },
};

const DEVO_PLUGIN_CONFIG = {
    ...BASE_CONFIG,
    output: {
        dir: "test-vault/.obsidian/plugins/obsidian-bujo",
        sourcemap: "inline",
        format: "cjs",
        exports: "default",
        name: "DEVO",
    },
    plugins: [
        ...DEFAULT_PLUGINS,
        copy({
            targets: [
                { src: "manifest.json", dest: "test-vault/.obsidian/plugins/obsidian-bujo/" },
                { src: "styles.css", dest: "test-vault/.obsidian/plugins/obsidian-bujo/" },
            ],
        }),
    ],
};

const PROD_PLUGIN_CONFIG = {
    ...BASE_CONFIG,
    output: {
        dir: "build",
        sourcemap: "inline",
        sourcemapExcludeSources: true,
        format: "cjs",
        exports: "default",
        name: "PROD",
    },
    plugins: [...DEFAULT_PLUGINS, optimizeLodashImports()],
};

export default [process.env.BUILD === "PROD" ? PROD_PLUGIN_CONFIG : DEVO_PLUGIN_CONFIG];
