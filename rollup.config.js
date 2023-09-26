import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import webWorker from "rollup-plugin-web-worker-loader";
import copy from "rollup-plugin-copy";
import typescript2 from "rollup-plugin-typescript2";

const getRollupPlugins = (tsconfig, ...plugins) => [
    typescript2(tsconfig),
    nodeResolve({ browser: true }),
    commonjs(),
    webWorker({ inline: true, forceInline: true, targetPlatform: "browser" }),
    ...plugins,
];

const BASE_CONFIG = {
    input: "src/main.ts",
    external: ["obsidian", "obsidian-dataview", "@codemirror/view", "@codemirror/state", "@codemirror/language"],
    onwarn: (warning, warn) => {
        // Sorry rollup, but we're using eval...
        if (/Use of eval is strongly discouraged/.test(warning.message)) return;
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
    plugins: getRollupPlugins(
        undefined,
        copy({
            targets: [
                { src: "manifest.json", dest: "test-vault/.obsidian/plugins/obsidian-bujo/" },
                { src: "styles.css", dest: "test-vault/.obsidian/plugins/obsidian-bujo/" },
            ],
        }),
    ),
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
    plugins: getRollupPlugins(),
};

export default [process.env.BUILD === "PROD" ? PROD_PLUGIN_CONFIG : DEVO_PLUGIN_CONFIG];
