import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS } from "../bujo-settings";
import { PeriodicLog } from "../collections/periodic-log";

describe("DEFAULT_SETTINGS", () => {
    it.each(DEFAULT_SETTINGS.collections.periodic)("holds valid collections.periodic[%#] = %j", config => {
        expect(() => new PeriodicLog(config)).not.toThrow();
    });
});
