import structuredClone from "@ungap/structured-clone";
import { DEFAULT_SETTINGS, ObsidianBujoSettings } from "./settings";

export class SettingsLoader {
    private settings: ObsidianBujoSettings = DEFAULT_SETTINGS;

    constructor(
        private readonly provider: () => Promise<ObsidianBujoSettings>,
        private readonly consumer: (settings: ObsidianBujoSettings) => Promise<void>,
    ) {}

    get(): ObsidianBujoSettings {
        return this.settings;
    }

    update(partial: Partial<ObsidianBujoSettings>) {
        this.settings = structuredClone({ ...this.settings, ...partial });
    }

    async load() {
        return (this.settings = structuredClone({ ...DEFAULT_SETTINGS, ...(await this.provider()) }));
    }

    async save() {
        await this.consumer(this.settings);
    }
}
