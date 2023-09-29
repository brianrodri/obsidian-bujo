import assert from "assert";
import { ObsidianBujoIndex } from "index";
import { Plugin } from "obsidian";
import { DataviewRenderer } from "renderers/dataview-renderer";
import { ObsidianBujoSettings } from "settings/settings";
import { SettingsLoader } from "settings/settings-manager";
import { View } from "views";

export default class ObsidianBujo extends Plugin {
    private readonly loader = new SettingsLoader(
        () => this.loadData() as Promise<ObsidianBujoSettings>,
        (data: ObsidianBujoSettings) => this.saveData(data),
    );

    override async onload() {
        const { collections } = await this.loader.load();
        const index = new ObsidianBujoIndex(collections);

        this.registerMarkdownCodeBlockProcessor("bujo", (source, el, { sourcePath }) => {
            const context = index.tryResolveContext(sourcePath);
            assert(context);
            const renderer = new DataviewRenderer(this, el, sourcePath);
            const asyncViews = source.split(/\s+/).map(async id => renderer.render(View({ id, ...context })));
            Promise.allSettled(asyncViews).catch(console.error);
        });
    }
}
