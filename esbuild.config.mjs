import builtins from "builtin-modules";
import esbuild from "esbuild";
import fs from "fs";
import process from "process";

const testVaultPluginPath = "test-vault/.obsidian/plugins/obsidian-bujo";
const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = process.argv[2] === "production";

const context = await esbuild.context({
    banner: {
        js: banner,
    },
    entryPoints: ["src/main.ts"],
    bundle: true,
    external: [
        "obsidian",
        "obsidian-dataview",
        "electron",
        "@codemirror/autocomplete",
        "@codemirror/collab",
        "@codemirror/commands",
        "@codemirror/language",
        "@codemirror/lint",
        "@codemirror/search",
        "@codemirror/state",
        "@codemirror/view",
        "@lezer/common",
        "@lezer/highlight",
        "@lezer/lr",
        ...builtins,
    ],
    format: "cjs",
    target: "es2018",
    logLevel: "info",
    sourcemap: prod ? false : "inline",
    treeShaking: true,
    outfile: prod ? "main.js" : `${testVaultPluginPath}/main.js`,
});

if (prod) {
    await context.rebuild();
    process.exit(0);
} else {
    fs.rmSync(`${testVaultPluginPath}/README.md`);
    fs.rmSync(`${testVaultPluginPath}/manifest.json`);
    fs.linkSync("manifest.json", `${testVaultPluginPath}/manifest.json`);
    fs.linkSync("README.md", `${testVaultPluginPath}/README.md`);
    await context.watch();
}
