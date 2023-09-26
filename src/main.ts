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

    async loadSettings(): Promise<ObsidianBujoSettings> {
        return (await this.loadData()) as ObsidianBujoSettings;
    }

    async saveSettings(settings: ObsidianBujoSettings): Promise<void> {
        await this.saveData(settings);
    }
}
