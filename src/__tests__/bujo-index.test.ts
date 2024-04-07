import { describe, expect, it } from "vitest";
import { ObsidianBujoIndex } from "../bujo-index";
import { PeriodicLog, PeriodicLogConfig } from "../collections/periodic-log";
import { zipWith } from "lodash";

describe("ObsidianBujoIndex", () => {
    const newPeriodicIndex = (...periodic: PeriodicLogConfig[]) => new ObsidianBujoIndex({ periodic });

    const UNIQUE_IDS = ["index", "hobby-ideas", "toy-collection"];
    const DUPLICATE_IDS = ["index", "toy-collection", "toy-collection"];
    const UNIQUE_FOLDERS = ["/", "Hobbies", "Toys"];
    const DUPLICATE_FOLDERS = ["/", "Hobbies", "Hobbies"];

    const mockConfig = (id: string, folder: string): PeriodicLogConfig => ({
        id,
        dir: folder,
        fileNameFormat: "yyyy-MM-dd",
        titleFormat: "MMMM d, yyyy",
        period: "P1D",
    });

    describe("Validation", () => {
        it("accepts configs with unique ids and folders", () => {
            const configs = zipWith(UNIQUE_IDS, UNIQUE_FOLDERS, mockConfig);
            expect(() => newPeriodicIndex(...configs)).not.toThrow();
        });

        it.each([
            ["duplicate folders", zipWith(UNIQUE_IDS, DUPLICATE_FOLDERS, mockConfig)],
            ["duplicate ids", zipWith(DUPLICATE_IDS, UNIQUE_FOLDERS, mockConfig)],
            ["duplicate ids and folders", zipWith(DUPLICATE_IDS, DUPLICATE_FOLDERS, mockConfig)],
        ])("rejects configs with %s", (_title, configsWithDuplicates) => {
            expect(() => newPeriodicIndex(...configsWithDuplicates)).toThrow("must have unique");
        });
    });

    describe(".getCollections()", () => {
        it("returns expected collections", () => {
            const index = newPeriodicIndex(mockConfig("index", "/"), mockConfig("hobbies", "Hobbies"));
            expect(index.getCollections()).toEqual(
                expect.arrayContaining([
                    new PeriodicLog(mockConfig("index", "/")),
                    new PeriodicLog(mockConfig("hobbies", "Hobbies")),
                ]),
            );
        });
    });
});
