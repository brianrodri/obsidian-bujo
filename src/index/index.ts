import { ICollection } from "collections/collection";
import { PeriodicLog } from "collections/periodic-log";
import { ObsidianBujoSettings } from "settings/settings";
import { ViewContext } from "views/view-context";

type CollectionWithFolder = ICollection & { folder: string };

export class ObsidianBujoIndex {
    public readonly collections: ReadonlyMap<string, ICollection>;

    constructor(configs: ObsidianBujoSettings["collections"]) {
        const periodicLogs: PeriodicLog[] = configs.periodic.map(cfg => new PeriodicLog(cfg));
        this.validateFolders(...periodicLogs);

        const collections: ICollection[] = [...periodicLogs];
        this.validateIdentifiers(...collections);

        this.collections = new Map(collections.map(collection => [collection.getUserDefinedIdentifier(), collection]));
    }

    resolveContext(notePath: string): ViewContext {
        for (const collection of this.collections.values()) {
            const note = collection.resolveNote(notePath);
            if (note) return { note, collection };
        }
        throw new Error("Failed to resolve a collection from: " + notePath);
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
        if (new Set(collections.map(c => c.getUserDefinedIdentifier())).size !== collections.length) {
            throw new Error("All collections must have unique folders");
        }
    }
}
