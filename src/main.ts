import { DataviewRenderer } from "renderers/dataview-renderer";
import { ObsidianBujoIndex } from "index";
import { App, Plugin, PluginManifest } from "obsidian";
import { ObsidianBujoSettings } from "settings/settings";
import { SettingsManager } from "settings/settings-manager";
import { HeaderView } from "views/header-view";
import { NavigationView } from "views/navigation-view";

export default class ObsidianBujo extends Plugin {
    private settingsManager: SettingsManager;

    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);
        this.settingsManager = new SettingsManager(
            () => this.loadSettings(),
            data => this.saveSettings(data),
        );
    }

    override async onload() {
        await this.settingsManager.load();
        const index = new ObsidianBujoIndex(this.settingsManager.get())!;

        this.registerMarkdownCodeBlockProcessor("bujo", async (source, el, ctx) => {
            const viewContext = index.tryResolveContext(ctx.sourcePath);
            if (!viewContext) {
                console.error("Trying to execute `bujo` outside of a collection");
                return;
            }
            const renderer = new DataviewRenderer(this, el, ctx.sourcePath);
            for (const viewId of source.split(/\s+/)) {
                try {
                    switch (viewId) {
                        case "header":
                            await renderer.render(HeaderView(viewContext));
                            break;
                        case "navigation":
                            await renderer.render(NavigationView(viewContext));
                            break;
                        default:
                            break;
                    }
                } catch (error) {
                    const id = viewContext.collection.getUserDefinedIdentifier();
                    console.error(`failed to render ${viewId} for ${id}`, error);
                }
            }
        });
    }

    override async onunload() {
        await this.settingsManager.save();
    }

    async loadSettings() {
        return (await this.loadData()) as ObsidianBujoSettings;
    }

    async saveSettings(settings: ObsidianBujoSettings) {
        await this.saveData(settings);
    }
}
