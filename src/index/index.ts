import { ICollection } from "collections/collection";
import { PeriodicLog } from "collections/periodic-log";
import { ObsidianBujoSettings } from "settings/settings";

export class ObsidianBujoIndex {
    public readonly periodicLogs: PeriodicLog[];

    constructor(settings: ObsidianBujoSettings) {
        this.periodicLogs = settings.collections.periodic.map(cfg => new PeriodicLog(cfg));

        this.validateIdentifiers();
    }

    getCollections(): ICollection[] {
        return [...this.periodicLogs];
    }

    private validateIdentifiers() {
        const collections = this.getCollections();
        if (new Set(collections.map(c => c.getIdentifier())).size !== collections.length) {
            throw new Error("All identifiers must be unique");
        }
    }
}
