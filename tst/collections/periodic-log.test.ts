import { describe, expect, it } from "vitest";
import { PeriodicLog } from "src/collections/periodic-log";
import { Interval } from "luxon";

// September 2023
// ==============
// |     | Mon | Tue | Wed | Thu | Fri | Sat | Sun |
// |:---:| ---:| ---:| ---:| ---:| ---:| ---:| ---:|
// | W35 |     |     |     |     |   1 |   2 |   3 |
// | W36 |   4 |   5 |   6 |   7 |   8 |   9 |  10 |
// | W37 |  11 |  12 |  13 |  14 |  15 |  16 |  17 |
// | W38 |  18 |  19 |  20 |  21 |  22 |  23 |  24 |
// | W39 |  25 |  26 |  27 |  28 |  29 |  30 |     |

describe("PeriodicLog", () => {
    it("returns daily interval", () => {
        const log = new PeriodicLog({kind: "periodic-log", folder: "Daily Logs", period: "P1D"});
        expect(log.getInterval("2023-09-17")).toEqual(Interval.fromISO("2023-09-17/2023-09-18"));
    });

    it("returns weekly interval", () => {
        const log = new PeriodicLog({kind: "periodic-log", folder: "Weekly Logs", period: "P1W"});
        expect(log.getInterval("2023-W37")).toEqual(Interval.fromISO("2023-09-11/2023-09-18"));
    });

    it("returns sprint interval (2 weeks long, starts on thursday)", () => {
        const log = new PeriodicLog({kind: "periodic-log", folder: "Sprint Logs", period: "P2W", offset: "P3D"});
        expect(log.getInterval("2023-W37")).toEqual(Interval.fromISO("2023-09-14/2023-09-28"));
    });

    it("returns monthly interval", () => {
        const log = new PeriodicLog({kind: "periodic-log", folder: "Monthly Logs", period: "P1M"});
        expect(log.getInterval("2023-09")).toEqual(Interval.fromISO("2023-09-01/2023-10-01"));
    });
});
