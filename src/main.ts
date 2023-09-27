import { ICollection } from "collections/collection";
import { ObsidianBujoIndex } from "index";
import { App, Component, Plugin, PluginManifest } from "obsidian";
import { DataviewApi, getAPI } from "obsidian-dataview";
import { ReactNode } from "react";
import { ObsidianBujoSettings } from "settings/settings";
import { SettingsManager } from "settings/settings-manager";
import { HeaderView, IRenderer } from "views/header-view";

class DataviewJSRenderer implements IRenderer {
    constructor(
        public readonly api: DataviewApi,
        public readonly component: Component,
        public readonly container: HTMLElement,
        public readonly note: string,
        public readonly collection: ICollection,
    ) {}
    getTargetNote(): string {
        return this.note;
    }
    getTargetCollection(): ICollection {
        return this.collection;
    }
    async render(el: ReactNode) {
        await this.api.renderValue(el, this.container, this.component, this.collection.getVaultPath(this.note));
    }
}

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
                const renderer = new DataviewJSRenderer(getAPI()!, this, el, note, collection);
                switch (source) {
                    case "header-view":
                        await new HeaderView({}).apply(renderer);
                }
            } else {
                console.error("oh well!");
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
