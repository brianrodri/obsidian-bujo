import { ObsidianBujoIndex } from "index";
import { Plugin } from "obsidian";
import { DataviewRenderer } from "renderers/dataview-renderer";
import { DEFAULT_SETTINGS } from "settings/settings";
import { ObsidianBujoView } from "views/bujo-view";
import { Resolver } from "utils/resolver";

export default class ObsidianBujo extends Plugin {
    private readonly resolver = new Resolver(this.loadData.bind(this), this.saveData.bind(this), DEFAULT_SETTINGS);

    override async onload() {
        const { collections } = await this.resolver.load();
        const index = new ObsidianBujoIndex(collections);
        this.registerMarkdownCodeBlockProcessor("bujo", (source, el, { sourcePath }) => {
            const context = index.resolveContext(sourcePath);
            new DataviewRenderer(this, el, sourcePath)
                .render(ObsidianBujoView({ source, ...context }))
                .catch(console.error);
        });
    }
}
