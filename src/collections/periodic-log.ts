import { DateTime, Duration, Interval } from "luxon";

export class PeriodicLog {
    public readonly kind = "periodic-log" as const;
    public readonly period: Duration;
    public readonly offset: Duration;

    constructor(cfg: PeriodicLogConfig) {
        this.period = Duration.fromISO(cfg.period);
        this.offset = Duration.fromISO(cfg.offset ?? "PT0S");
    }

    getInterval(fileName: string): Interval {
        const fileDate = DateTime.fromISO(fileName);
        const start = fileDate.plus(this.offset);
        const end = start.plus(this.period);
        return start.until(end);
    }
}

export type PeriodicLogConfig = {
    readonly kind: PeriodicLog["kind"];
    readonly folder: string;
    readonly period: string;
    readonly offset?: string;
}
