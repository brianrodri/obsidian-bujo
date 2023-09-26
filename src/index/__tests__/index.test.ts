import { ObsidianBujoIndex } from "index/index";
import { describe, it, expect } from "@jest/globals";
import { PeriodicLogConfig } from "collections/periodic-log";
import { ObsidianBujoSettings } from "settings/settings";

function getPeriodicLog({ ...neededByTest }: Partial<PeriodicLogConfig>) {
    return {
        id: "id",
        folder: "folder",
        fileNameFormat: "yyyy-MM-dd",
        titleFormat: "MMMM d, yyyy",
        period: "P1D",
        ...neededByTest,
    };
}

describe("ObsidianBujoIndex", () => {
    describe("Validation", () => {
        it("accepts collections with unique ids", () => {
            const validIndexProvider = () =>
                new ObsidianBujoIndex({
                    collections: {
                        periodic: "a b c".split(" ").map((id) => getPeriodicLog({ id })),
                    },
                });

            expect(validIndexProvider).not.toThrow();
        });

        it("rejects collections with duplicate ids", () => {
            const validIndexProvider = () =>
                new ObsidianBujoIndex({
                    collections: {
                        periodic: "a b a".split(" ").map((id) => getPeriodicLog({ id })),
                    },
                });

            expect(validIndexProvider).toThrow("identifiers must be unique");
        });
    });
});
