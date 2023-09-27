import { DataviewRenderer } from "renderers/dataview-renderer";
import { ObsidianBujoIndex } from "index";
import { App, Plugin, PluginManifest } from "obsidian";
import { getAPI } from "obsidian-dataview";
import { ObsidianBujoSettings } from "settings/settings";
import { SettingsManager } from "settings/settings-manager";
import { HeaderView } from "views/header-view";

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
            const [note, collection] = index.resolveNote(ctx.sourcePath);
            if (note && collection) {
                const renderer = new DataviewRenderer(getAPI()!, this, el, note, collection);
                for (const viewId of source.split("\n")) {
                    try {
                        switch (viewId) {
                            case "header-view":
                                await new HeaderView({}).apply(renderer);
                                break;
                            default:
                                break;
                        }
                    } catch (error) {
                        console.error(`failed to render ${viewId} for ${collection.getIdentifier()}`, error);
                    }
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
