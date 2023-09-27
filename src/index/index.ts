import { ICollection } from "collections/collection";
import { PeriodicLog } from "collections/periodic-log";
import { ObsidianBujoSettings } from "settings/settings";

export class ObsidianBujoIndex {
    public readonly periodicLogs: Map<string, PeriodicLog>;

    constructor(settings: ObsidianBujoSettings) {
        const periodicLogs = settings.collections.periodic.map(cfg => new PeriodicLog(cfg));
        this.validateIdentifiers(...periodicLogs);
        this.validateFolders(...periodicLogs);

        this.periodicLogs = new Map(periodicLogs.map(log => [log.getIdentifier(), log]));
    }

    getCollections(): ICollection[] {
        return [...this.periodicLogs.values()] as ICollection[];
    }

    private validateFolders(...logs: PeriodicLog[]) {
        if (new Set(logs.map(l => l.folder)).size !== logs.length) {
            throw new Error("All folders must be unique");
        }
    }

    private validateIdentifiers(...collections: ICollection[]) {
        if (new Set(collections.map(c => c.getIdentifier())).size !== collections.length) {
            throw new Error("All identifiers must be unique");
        }
    }
}
