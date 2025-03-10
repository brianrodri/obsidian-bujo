import { DateTime, Interval } from "luxon";
import { describe, expect, it } from "vitest";
import { PeriodicLog, PeriodicLogConfig } from "../periodic-log";

describe("PeriodicLog", () => {
    // This test uses dates in September 2023 because that's when I wrote the code. Here's a calendar:
    //
    // September 2023
    // ==============
    // |     | Mon | Tue | Wed | Thu | Fri | Sat | Sun |
    // | --- | --- | --- | --- | --- | --- | --- | --- |
    // | W35 |     |     |     |     |   1 |   2 |   3 |
    // | W36 |   4 |   5 |   6 |   7 |   8 |   9 |  10 |
    // | W37 |  11 |  12 |  13 |  14 |  15 |  16 |  17 |
    // | W38 |  18 |  19 |  20 |  21 |  22 |  23 |  24 |
    // | W39 |  25 |  26 |  27 |  28 |  29 |  30 |     |

    // Valid and logically-consistent config for tests that don't care about some of the values.
    const etc: PeriodicLogConfig = {
        id: "id",
        dir: "Logs",
        period: "P1D",
        fileNameFormat: "yyyy-MM-dd",
        titleFormat: "yyyy-MM-dd",
    };

    describe("Validating input", () => {
        it.each([null, undefined, ""] as string[])("throws when id is %j", (id: string) => {
            expect(() => new PeriodicLog({ ...etc, id })).toThrowError("id is required");
        });

        it.each([null, undefined, ""] as string[])("throws when folder is %j", (folder: string) => {
            expect(() => new PeriodicLog({ ...etc, dir: folder })).toThrowError("folder is required");
        });

        it.each([null, undefined, ""] as string[])("throws when period is %j", (period: string) => {
            expect(() => new PeriodicLog({ ...etc, period })).toThrowError("period is required");
        });

        it.each(["1 hour", { hour: 1 }] as string[])("throws when period is %j", (period: string) => {
            expect(() => new PeriodicLog({ ...etc, period })).toThrowError("unparsable");
        });

        it.each(["1 hour", { hour: 1 }] as string[])("throws when offset is %j", (offset: string) => {
            expect(() => new PeriodicLog({ ...etc, offset })).toThrowError("unparsable");
        });

        it.each([null, undefined, ""] as string[])("throws when fileNameFormat is %j", (fileNameFormat: string) => {
            expect(() => new PeriodicLog({ ...etc, fileNameFormat })).toThrowError("fileNameFormat is required");
        });
    });

    describe(".getID()", () => {
        it("returns configured id", () => {
            const log = new PeriodicLog({ ...etc, id: "death-note" });

            expect(log.getID()).toEqual("death-note");
        });
    });

    describe(".includes()", () => {
        const log = new PeriodicLog({ ...etc, dir: "Logs/Months", fileNameFormat: "yyyy-MM" });

        it("resolves path when folder is right and format is right", () => {
            expect(log.includes("Logs/Months/2023-09.md")).toBe(true);
        });

        it("resolves path when correct folder is the root directory", () => {
            const log = new PeriodicLog({ ...etc, dir: "/", fileNameFormat: "yyyy-MM" });

            expect(log.includes("2023-09.md")).toBe(true);
        });

        it.each([
            ["Logs/Days", "yyyy-MM"],
            ["Logs/Months", "yyyy-MM-dd"],
            ["Logs/Days", "yyyy-MM-dd"],
        ])('rejects invalid path: "%s/%s"', (folder: string, format: string) => {
            const fileName = DateTime.fromISO("2023-09-26").toFormat(format) + ".md";
            expect(log.includes(`${folder}/${fileName}`)).toBe(false);
        });
    });

    describe(".getNoteTitle()", () => {
        // NOTE: These tests may fail if they're run just before midnight, but I don't care enough to fix it ;)

        it("returns title using now-format when note is today", () => {
            const log = new PeriodicLog({
                ...etc,
                fileNameFormat: "yyyy-MM-dd",
                titleFormat: "MMMM d, yyyy",
                nowTitleFormat: "'Today'",
            });
            const nameOfTodaysNote = DateTime.now().toFormat(log.fileNameFormat);

            expect(log.getNoteTitle(nameOfTodaysNote)).toEqual("Today");
        });

        it("returns title using default-format when note takes place today but nowFormat is undefined", () => {
            const log = new PeriodicLog({
                ...etc,
                fileNameFormat: "yyyy-MM-dd",
                titleFormat: "MMMM d, yyyy",
                nowTitleFormat: undefined,
            });
            const now = DateTime.now();
            const nameOfTodaysNote = now.toFormat(log.fileNameFormat);

            expect(log.getNoteTitle(nameOfTodaysNote)).toEqual(now.toFormat(log.titleFormat));
        });

        it("returns title using default-format when the note isn't today", () => {
            const log = new PeriodicLog({
                ...etc,
                fileNameFormat: "yyyy-MM-dd",
                titleFormat: "MMMM d, yyyy",
                nowTitleFormat: "'Today'",
            });
            const yesterday = DateTime.now().minus({ day: 1 });
            const nameOfYesterdaysNote = yesterday.toFormat(log.fileNameFormat);

            expect(log.getNoteTitle(nameOfYesterdaysNote)).toEqual(yesterday.toFormat(log.titleFormat));
        });
    });

    describe(".getNoteInterval()", () => {
        it("supports daily intervals", () => {
            const log = new PeriodicLog({ ...etc, period: "P1D", fileNameFormat: "yyyy-MM-dd" });
            expect(log.getNoteInterval("2023-09-11")).toEqual(Interval.fromISO("2023-09-11/2023-09-12"));
        });

        it("supports weekly intervals", () => {
            const log = new PeriodicLog({ ...etc, period: "P1W", fileNameFormat: "kkkk-'W'WW" });
            expect(log.getNoteInterval("2023-W37")).toEqual(Interval.fromISO("2023-09-11/2023-09-18"));
        });

        it("supports sprint intervals (2 weeks long, starts on thursday)", () => {
            const log = new PeriodicLog({
                ...etc,
                period: "P2W",
                offset: "P3D",
                fileNameFormat: "kkkk-'W'WW",
            });
            expect(log.getNoteInterval("2023-W37")).toEqual(Interval.fromISO("2023-09-14/2023-09-28"));
        });

        it("supports monthly intervals", () => {
            const log = new PeriodicLog({ ...etc, period: "P1M", fileNameFormat: "yyyy-MM" });
            expect(log.getNoteInterval("2023-09")).toEqual(Interval.fromISO("2023-09-01/2023-10-01"));
        });
    });

    describe(".getVaultPath()", () => {
        it("returns path with configured folder", () => {
            const log = new PeriodicLog({ ...etc, dir: "Vault/Directory/To" });

            expect(log.getVaultPath("My Note")).toEqual("Vault/Directory/To/My Note");
        });
    });

    describe(".getDataViewSource()", () => {
        it("returns the configured folder as the source", () => {
            const log = new PeriodicLog({ ...etc, dir: "Folder" });
            expect(log.getDataViewSource()).toEqual(`"Folder"`);
        });
    });
});
