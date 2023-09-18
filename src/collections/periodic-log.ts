import { DateTime, Duration, Interval } from "luxon";

export class PeriodicLog {
    public readonly kind = "periodic-log" as const;
    public readonly duration: Duration;
    public readonly offset: Duration;

    constructor(cfg: PeriodicLogConfig) {
        this.duration = Duration.fromISO(cfg.duration);
        this.offset = Duration.fromISO(cfg.offset ?? "PT0S");
    }

    getInterval(fileName: string): Interval {
        const fileDate = DateTime.fromISO(fileName);
        const start = fileDate.plus(this.offset);
        const end = start.plus(this.duration);
        return start.until(end);
    }
}

export type PeriodicLogConfig = {
    readonly kind: PeriodicLog["kind"];
    readonly folder: string;
    readonly duration: string;
    readonly offset?: string;
}
