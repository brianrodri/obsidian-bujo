import { DateTime, Duration, Interval } from "luxon";
import { ICollection } from "collections/collection";
import assert from "assert";

export class PeriodicLog implements ICollection {
    // User-defined identifier
    public readonly id: string;

    // File system config
    public readonly folder: string;
    public readonly fileNameFormat: string;

    // Format config -- TODO: Move this into the HeaderView config.
    public readonly titleFormat: string;
    public readonly nowTitleFormat: string;

    // Interval config
    public readonly period: Duration;
    public readonly offset: Duration;

    constructor(config: PeriodicLogConfig) {
        this.validate(config);
        this.id = config.id;
        this.folder = config.folder;
        this.period = Duration.fromISO(config.period);
        this.offset = config.offset ? Duration.fromISO(config.offset) : Duration.fromMillis(0);
        this.fileNameFormat = config.fileNameFormat;
        this.titleFormat = config.titleFormat;
        this.nowTitleFormat = config.nowTitleFormat ?? this.titleFormat;
    }

    resolveNote(vaultPath: string): string | undefined {
        const [, vaultFolder = "/", fileName = vaultPath] = vaultPath.match(/^(.*)\/(.*)$/) ?? [];
        if (vaultFolder === this.folder && DateTime.fromFormat(fileName, this.fileNameFormat + "'.md'").isValid) {
            return fileName.replace(/\.md$/, "");
        }
        return undefined;
    }

    getUserDefinedIdentifier(): string {
        return this.id;
    }

    getSortKey(note: string): string {
        const key = DateTime.fromFormat(note, this.fileNameFormat).toISO();
        assert(key);
        return key;
    }

    getVaultPath(note: string): string {
        return `${this.folder}/${note}`;
    }

    getNoteTitle(note: string): string {
        const interval = this.getNoteInterval(note);
        assert(interval.start);
        return interval.start.toFormat(interval.contains(DateTime.now()) ? this.nowTitleFormat : this.titleFormat);
    }

    getNoteInterval(note: string): Interval {
        const fileDate = DateTime.fromFormat(note, this.fileNameFormat);
        const start = fileDate.plus(this.offset);
        const end = start.plus(this.period);
        return start.until(end);
    }

    getDataViewSource(): string {
        return `"${this.folder}"`;
    }

    private validate(config: PeriodicLogConfig) {
        if (!config.id) {
            throw new Error(`id is required but got value: ${JSON.stringify(config.id)}`);
        }
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
    // User-defined identifier
    id: string;

    // File system config
    folder: string;
    fileNameFormat: string;

    // Format config
    titleFormat: string;
    nowTitleFormat?: string;

    // Interval config
    period: string;
    offset?: string;
};
