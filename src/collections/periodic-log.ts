import { DateTime, Duration, Interval } from "luxon";
import { ICollection } from "./collection";

export class PeriodicLog implements ICollection {
    public readonly folder: string;
    public readonly fileNameFormat: string;
    public readonly titleFormat: string;
    public readonly nowTitleFormat: string;
    public readonly period: Duration;
    public readonly offset: Duration;

    constructor(config: PeriodicLogConfig) {
        this.validate(config);
        this.folder = config.folder;
        this.period = Duration.fromISO(config.period);
        this.offset = config.offset ? Duration.fromISO(config.offset) : Duration.fromMillis(0);
        this.fileNameFormat = config.fileNameFormat;
        this.titleFormat = config.titleFormat;
        this.nowTitleFormat = config.nowTitleFormat ?? this.titleFormat;
    }

    getTitle(noteName: string): string {
        const interval = this.getInterval(noteName);
        return interval.start!.toFormat(interval.contains(DateTime.now()) ? this.nowTitleFormat : this.titleFormat);
    }

    getInterval(noteName: string): Interval {
        const fileDate = DateTime.fromFormat(noteName, this.fileNameFormat);
        const start = fileDate.plus(this.offset);
        const end = start.plus(this.period);
        return start.until(end);
    }

    getDataViewSource(): string {
        return `"${this.folder}"`;
    }

    private validate(config: PeriodicLogConfig) {
        if (!config.folder) {
            throw new Error(`folder is required but got value: ${JSON.stringify(config.folder)}`);
        }
        if (!config.fileNameFormat) {
            throw new Error(`fileNameFormat is required but got value: ${JSON.stringify(config.fileNameFormat)}`);
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
}

export type PeriodicLogConfig = {
    // File system config
    readonly folder: string;
    readonly fileNameFormat: string;

    // Format config
    readonly titleFormat: string;
    readonly nowTitleFormat?: string;

    // Interval config
    readonly period: string;
    readonly offset?: string;
};
