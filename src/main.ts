import { App, Plugin, PluginManifest } from "obsidian";
import { SettingsManager } from "settings/settings-manager";

export default class ObsidianBujo extends Plugin {
    private settingsManager: SettingsManager;

    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);
        this.settingsManager = new SettingsManager(this.loadData, this.saveData);
    }

    override async onload() {
        await this.settingsManager.load();
    }
}
