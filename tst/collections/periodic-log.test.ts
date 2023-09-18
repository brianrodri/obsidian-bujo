import { describe, expect, it } from "vitest";
import { PeriodicLog, PeriodicLogConfig } from "src/collections/periodic-log";
import { DateTime, Interval } from "luxon";

describe("PeriodicLog", () => {
    const DAILY_LOG_CONFIG: PeriodicLogConfig = {
        kind: "periodic-log",
        folder: "Daily Logs",
        duration: "P1D",
    };
    const WEEKLY_LOG_CONFIG: PeriodicLogConfig = {
        kind: "periodic-log",
        folder: "Weekly Logs",
        duration: "P1W",
    };
    const SPRINT_LOG_CONFIG: PeriodicLogConfig = {
        kind: "periodic-log",
        folder: "Sprint Logs",
        duration: "P2W",
        offset: "P3D",
    };

    it("has a distinct kind", () => {
        const log = new PeriodicLog(DAILY_LOG_CONFIG);
        expect(log.kind).toEqual("periodic-log");
    });

    it("returns interval for day", () => {
        const log = new PeriodicLog(DAILY_LOG_CONFIG);
        const itvl = log.getInterval("2023-09-17");
        expect(itvl).toEqual(Interval.fromDateTimes(DateTime.fromISO("2023-09-17"),
                                                    DateTime.fromISO("2023-09-18")));
    });

    it("returns interval for week", () => {
        const log = new PeriodicLog(WEEKLY_LOG_CONFIG);
        const itvl = log.getInterval("2023-W37");
        expect(itvl).toEqual(Interval.fromDateTimes(DateTime.fromISO("2023-09-11"),
                                                    DateTime.fromISO("2023-09-18")));
    });

    it("returns interval for sprint (2 weeks long, start on thursday)", () => {
        const log = new PeriodicLog(SPRINT_LOG_CONFIG);
        const itvl = log.getInterval("2023-W37");
        expect(itvl).toEqual(Interval.fromDateTimes(DateTime.fromISO("2023-09-14"),
                                                    DateTime.fromISO("2023-09-28")));
    });
});
