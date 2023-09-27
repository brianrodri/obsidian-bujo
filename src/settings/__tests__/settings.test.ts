import { describe, expect, it } from "@jest/globals";
import { PeriodicLog } from "collections/periodic-log";
import { DEFAULT_SETTINGS } from "settings/settings";

describe("DEFAULT_SETTINGS", () => {
    it.each(DEFAULT_SETTINGS.collections.periodic)("holds valid collections.periodic[%#] = %j", config => {
        expect(() => new PeriodicLog(config)).not.toThrow();
    });
});
