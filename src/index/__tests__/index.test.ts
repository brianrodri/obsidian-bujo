import { ObsidianBujoIndex } from "index/index";
import { describe, it, expect } from "@jest/globals";
import { PeriodicLog, PeriodicLogConfig } from "collections/periodic-log";

function newPeriodicIndex(...periodic: PeriodicLogConfig[]) {
    return new ObsidianBujoIndex({ collections: { periodic } });
}

const withConfig = (id: string, folder: string): PeriodicLogConfig => ({
    fileNameFormat: "yyyy-MM-dd",
    titleFormat: "MMMM d, yyyy",
    period: "P1D",
    folder,
    id,
});

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
            expect(() => newPeriodicIndex(...ids.map((id, i) => withConfig(id, folders[i])))).toThrow(
                "must have unique",
            );
        });
    });

    describe(".getCollections()", () => {
        it("returns expected collections", () => {
            const index = newPeriodicIndex(withConfig("index", "/"), withConfig("hobbies", "Hobbies"));
            expect(index.getCollections()).toEqual(
                expect.arrayContaining([
                    new PeriodicLog(withConfig("index", "/")),
                    new PeriodicLog(withConfig("hobbies", "Hobbies")),
                ]),
            );
        });
    });

    describe(".resolveNote()", () => {
        it.each([
            ["2023-09-27.md", "index"],
            ["Hobbies/2023-09-27.md", "hobbies"],
        ])("resolves %j to %j", (notePath, collectionId) => {
            const index = newPeriodicIndex(withConfig("index", "/"), withConfig("hobbies", "Hobbies"));

            const { note, collection } = index.tryResolveContext(notePath)!;

            expect([note, collection.getUserDefinedIdentifier()]).toEqual(["2023-09-27", collectionId]);
        });

        it('fails to resolve "2023-09-27.md" without a daily log', () => {
            const index = newPeriodicIndex({ ...withConfig("/", "index"), fileNameFormat: "yyyy-MM" });

            expect(index.tryResolveContext("2023-09-27.md")).toBeNull();
        });
    });
});
