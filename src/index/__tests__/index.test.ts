import { ObsidianBujoIndex } from "index/index";
import { describe, it, expect } from "@jest/globals";
import { PeriodicLog, PeriodicLogConfig } from "collections/periodic-log";

const PERIODIC_ETC: PeriodicLogConfig = {
    id: "id",
    folder: "folder",
    fileNameFormat: "yyyy-MM-dd",
    titleFormat: "MMMM d, yyyy",
    period: "P1D",
};

function newPeriodicIndex(...periodicConfigs: Partial<PeriodicLogConfig>[]) {
    return new ObsidianBujoIndex({
        collections: {
            periodic: periodicConfigs.map(etc => ({ ...PERIODIC_ETC, ...etc })),
        },
    });
}

const withConfig = (id: string, folder: string): Partial<PeriodicLogConfig> => ({ folder, id });

describe("ObsidianBujoIndex", () => {
    describe("Validation", () => {
        it("accepts collections with unique ids and unique folders", () => {
            expect(() =>
                newPeriodicIndex(
                    withConfig("index", "/"),
                    withConfig("hobby-ideas", "Hobbies"),
                    withConfig("toy-collection", "Toys"),
                ),
            ).not.toThrow();
        });

        const UNIQUE_IDS = ["index", "hobby-ideas", "toy-collection"];
        const DUPLICATE_IDS = ["index", "toy-collection", "toy-collection"];
        const UNIQUE_FOLDERS = ["/", "Hobbies", "Toys"];
        const DUPLICATE_FOLDERS = ["/", "Hobbies", "Hobbies"];

        it.each([
            { ids: UNIQUE_IDS, folders: DUPLICATE_FOLDERS },
            { ids: DUPLICATE_IDS, folders: UNIQUE_FOLDERS },
            { ids: DUPLICATE_IDS, folders: DUPLICATE_FOLDERS },
        ])("rejects collections when folders=%j and ids=%j (due to duplicates)", ({ ids, folders }) => {
            expect(() => newPeriodicIndex(...ids.map((id, i) => withConfig(id, folders[i])))).toThrow("must be unique");
        });
    });

    describe(".getCollections()", () => {
        it("returns expected collections", () => {
            const index = newPeriodicIndex(withConfig("/", "Index"), withConfig("Hobbies", "Ideas"));
            expect(index.getCollections()).toEqual([
                new PeriodicLog({ ...PERIODIC_ETC, ...withConfig("/", "Index") }),
                new PeriodicLog({ ...PERIODIC_ETC, ...withConfig("Hobbies", "Ideas") }),
            ]);
        });
    });
});
