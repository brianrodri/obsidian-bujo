import { App, Plugin, PluginManifest } from "obsidian";
import { ObsidianBujoSettings } from "settings/settings";
import { SettingsManager } from "settings/settings-manager";

export default class ObsidianBujo extends Plugin {
    private settingsManager: SettingsManager;

    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);
        this.settingsManager = new SettingsManager(
            () => this.loadSettings(),
            (data) => this.saveSettings(data),
        );
    }

    override async onload() {
        await this.settingsManager.load();
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
