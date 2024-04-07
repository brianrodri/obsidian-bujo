import { ObsidianBujoSettings } from "./bujo-settings";
import { ICollection } from "./collections/collection";
import { PeriodicLog } from "./collections/periodic-log";

type CollectionWithFolder = ICollection & { dir: string };

export class ObsidianBujoIndex {
    private collections: ReadonlyMap<string, ICollection>;

    constructor(configs: ObsidianBujoSettings["collections"]) {
        const periodicLogs: PeriodicLog[] = configs.periodic.map(cfg => new PeriodicLog(cfg));
        this.validateDirs(...periodicLogs);

        const collections: ICollection[] = [...periodicLogs];
        this.validateIDs(...collections);

        this.collections = new Map(collections.map(collection => [collection.getID(), collection]));
    }

    getCollections(): ICollection[] {
        return [...this.collections.values()];
    }

    private validateDirs(...collections: CollectionWithFolder[]) {
        if (new Set(collections.map(c => c.dir)).size !== collections.length) {
            throw new Error("All collections must have unique folders");
        }
    }

    private validateIDs(...collections: ICollection[]) {
        if (new Set(collections.map(c => c.getID())).size !== collections.length) {
            throw new Error("All collections must have unique folders");
        }
    }
}
