import { describe, expect, it } from "vitest";
import { PeriodicLog } from "../../collections/periodic-log";
import { DEFAULT_SETTINGS } from "../settings";

describe("DEFAULT_SETTINGS", () => {
    it.each(DEFAULT_SETTINGS.collections.periodic)("holds valid collections.periodic[%#] = %j", config => {
        expect(() => new PeriodicLog(config)).not.toThrow();
    });
});
