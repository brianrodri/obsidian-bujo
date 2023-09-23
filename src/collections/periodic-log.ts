import { DateTime, Duration, Interval } from "luxon";

export class PeriodicLog {
    public readonly kind = "periodic-log" as const;
    public readonly folder: string;
    public readonly period: Duration;
    public readonly offset: Duration;

    constructor(config: PeriodicLogConfig) {
        this.validate(config);
        this.folder = config.folder;
        this.period = Duration.fromISO(config.period);
        this.offset = config.offset ? Duration.fromISO(config.offset) : Duration.fromMillis(0);
    }

    validate(config: PeriodicLogConfig) {
        if (config.kind !== this.kind) {
            throw new Error(`kind must be "${this.kind}" but got value: ${JSON.stringify(config.kind)}`);
        }
        if (!config.folder) {
            throw new Error(`folder is required but got value: ${JSON.stringify(config.folder)}`);
        }
        const period = Duration.fromISO(config.period);
        if (!period.isValid) {
            const error = `${period.invalidReason}: ${period.invalidExplanation}`;
            throw new Error(`period must be valid but got error: ${JSON.stringify(error)}`);
        }
        const offset = config.offset ? Duration.fromISO(config.offset) : Duration.fromMillis(0);
        if (!offset.isValid) {
            const error = `${offset.invalidReason}: ${offset.invalidExplanation}`;
            throw new Error(`offset must be valid but got error: ${JSON.stringify(error)}`);
        }
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
};
