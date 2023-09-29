import { ObsidianBujoIndex } from "index";
import { App, Plugin, PluginManifest } from "obsidian";
import { DataviewRenderer } from "renderers/dataview-renderer";
import { DEFAULT_SETTINGS, ObsidianBujoSettings } from "settings/settings";
import { Resolver } from "utils/resolver";
import { View } from "views";

export default class ObsidianBujo extends Plugin {
    private readonly loader: Resolver<ObsidianBujoSettings>;

    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);
        this.loader = new Resolver(this.loadData.bind(this), this.saveData.bind(this), DEFAULT_SETTINGS);
    }

    override async onload() {
        const { collections } = await this.loader.load();
        const index = new ObsidianBujoIndex(collections);

        this.registerMarkdownCodeBlockProcessor("bujo", (source, el, { sourcePath }) => {
            const ids = source.split(/\s+/).filter(Boolean);
            const context = index.resolveContext(sourcePath);
            const renderer = new DataviewRenderer(this, el, sourcePath);
            Promise.allSettled(ids.map(id => renderer.render(View({ id, ...context })))).catch(console.error);
        });
    }
}
