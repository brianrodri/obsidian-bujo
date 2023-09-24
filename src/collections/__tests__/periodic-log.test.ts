import { DateTime, Interval } from "luxon";
import { describe, expect, it } from "@jest/globals";
import { PeriodicLog, PeriodicLogConfig } from "collections/periodic-log";

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
        folder: "Logs",
        period: "P1D",
        fileNameFormat: "yyyy-MM-dd",
        titleFormat: "yyyy-MM-dd",
    };

    describe("Validating input", () => {
        it.each([null, undefined, ""])("throws when folder is %j", (folder: string) => {
            expect(() => new PeriodicLog({ ...etc, folder })).toThrowError("folder is required");
        });

        it.each(["1 hour", { hour: 1 }, null, undefined])("throws when period is %j", (period: string) => {
            expect(() => new PeriodicLog({ ...etc, period })).toThrowError("period must be valid");
        });

        it.each(["1 hour", { hour: 1 }])("throws when offset is %j", (offset: string) => {
            expect(() => new PeriodicLog({ ...etc, offset })).toThrowError("offset must be valid");
        });

        it.each([null, undefined, ""])("throws when fileNameFormat is %j", (fileNameFormat: string) => {
            expect(() => new PeriodicLog({ ...etc, fileNameFormat })).toThrowError("fileNameFormat is required");
        });
    });

    describe(".getNotePath()", () => {
        it("returns path with configured folder", () => {
            const log = new PeriodicLog({ ...etc, folder: "Vault/Directory/To" });

            expect(log.getNotePath("My Note")).toEqual("Vault/Directory/To/My Note");
        });
    });

    describe(".getTitle()", () => {
        // NOTE: These tests may fail if they're run just before midnight, but I don't care enough to fix it ;)

        it("returns title using now-format when note is today", () => {
            const log = new PeriodicLog({
                ...etc,
                fileNameFormat: "yyyy-MM-dd",
                titleFormat: "MMMM d, yyyy",
                nowTitleFormat: "'Today'",
            });
            const nameOfTodaysNote = DateTime.now().toFormat(log.fileNameFormat);

            expect(log.getTitle(nameOfTodaysNote)).toEqual("Today");
        });

        it("returns title using default-format when note takes place today but nowFormat is undefined", () => {
            const log = new PeriodicLog({
                ...etc,
                fileNameFormat: "yyyy-MM-dd",
                titleFormat: "MMMM d, yyyy",
                nowTitleFormat: undefined,
            });
            const nameOfTodaysNote = DateTime.now().toFormat(log.fileNameFormat);

            expect(log.getTitle(nameOfTodaysNote)).toEqual("September 24, 2023");
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

            expect(log.getTitle(nameOfYesterdaysNote)).toEqual(yesterday.toFormat(log.titleFormat));
        });
    });

    describe(".getDataViewSource()", () => {
        it("returns the configured folder as the source", () => {
            const log = new PeriodicLog({ ...etc, folder: "Folder" });
            expect(log.getDataViewSource()).toEqual(`"Folder"`);
        });
    });

    describe(".getInterval()", () => {
        it("supports daily intervals", () => {
            const log = new PeriodicLog({ ...etc, period: "P1D", fileNameFormat: "yyyy-MM-dd" });
            expect(log.getInterval("2023-09-11")).toEqual(Interval.fromISO("2023-09-11/2023-09-12"));
        });

        it("supports weekly intervals", () => {
            const log = new PeriodicLog({ ...etc, period: "P1W", fileNameFormat: "kkkk-'W'WW" });
            expect(log.getInterval("2023-W37")).toEqual(Interval.fromISO("2023-09-11/2023-09-18"));
        });

        it("supports sprint intervals (2 weeks long, starts on thursday)", () => {
            const log = new PeriodicLog({
                ...etc,
                period: "P2W",
                offset: "P3D",
                fileNameFormat: "kkkk-'W'WW",
            });
            expect(log.getInterval("2023-W37")).toEqual(Interval.fromISO("2023-09-14/2023-09-28"));
        });

        it("supports monthly intervals", () => {
            const log = new PeriodicLog({ ...etc, period: "P1M", fileNameFormat: "yyyy-MM" });
            expect(log.getInterval("2023-09")).toEqual(Interval.fromISO("2023-09-01/2023-10-01"));
        });
    });
});
