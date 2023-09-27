import { ICollection } from "collections/collection";
import { PeriodicLog } from "collections/periodic-log";
import { ObsidianBujoSettings } from "settings/settings";

type CollectionWithFolder = ICollection & { folder: string };

export class ObsidianBujoIndex {
    public readonly collections: ReadonlyMap<string, ICollection>;

    constructor(settings: ObsidianBujoSettings) {
        const periodicLogs: PeriodicLog[] = settings.collections.periodic.map(cfg => new PeriodicLog(cfg));
        this.validateFolders(...periodicLogs);

        const collections: ICollection[] = [...periodicLogs];
        this.validateIdentifiers(...collections);

        this.collections = new Map(collections.map(collection => [collection.getIdentifier(), collection]));
    }

    resolveNote(notePath: string): [string, ICollection] | [null, null] {
        for (const collection of this.collections.values()) {
            const note = collection.resolveNote(notePath);
            if (note) return [note, collection];
        }
        return [null, null];
    }

    getCollections(): ICollection[] {
        return [...this.collections.values()];
    }

    private validateFolders(...collections: CollectionWithFolder[]) {
        if (new Set(collections.map(c => c.folder)).size !== collections.length) {
            throw new Error("All collections must have unique folders");
        }
    }

    private validateIdentifiers(...collections: ICollection[]) {
        if (new Set(collections.map(c => c.getIdentifier())).size !== collections.length) {
            throw new Error("All collections must have unique folders");
        }
    }
}
