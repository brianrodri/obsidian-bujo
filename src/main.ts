import { Plugin } from "obsidian";
import { ObsidianBujoSettings } from "settings/settings";

export const DEFAULT_SETTINGS = {} as ObsidianBujoSettings;

export default class ObsidianBujo extends Plugin {
    private settings: ObsidianBujoSettings;

    override async onload() {
        await this.loadSettings();
    }

    override async onunload() {
        await this.saveSettings();
    }

    getSettings(): ObsidianBujoSettings {
        return this.settings;
    }

    setSettings(settings: Partial<ObsidianBujoSettings>) {
        this.settings = structuredClone({ ...this.settings, ...settings });
    }

    async loadSettings() {
        this.settings = structuredClone({ ...DEFAULT_SETTINGS, ...(await this.loadData()) });
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
