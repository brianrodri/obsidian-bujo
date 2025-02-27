import path from "path";
import { DateTime, Duration, Interval } from "luxon";
import { ICollection } from "./collection";
import { escapeRegExp } from "lodash";

/** @see {@link PeriodicLog} */
export interface PeriodicLogConfig {
    id: string;
    dir: string;
    fileNameFormat: string;
    titleFormat: string;
    nowTitleFormat?: string;
    period: string;
    offset?: string;
}

export class PeriodicLog implements ICollection {
    private static readonly VAULT_FILE_PATTERN = new RegExp("^(.*)" + escapeRegExp(path.sep) + "(.*)$");

    // User-defined identifier
    public readonly id: string;

    // File system config
    public readonly dir: string;
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
        this.dir = config.dir;
        this.period = Duration.fromISO(config.period);
        this.offset = config.offset ? Duration.fromISO(config.offset) : Duration.fromMillis(0);
        this.fileNameFormat = config.fileNameFormat;
        this.titleFormat = config.titleFormat;
        this.nowTitleFormat = config.nowTitleFormat ?? this.titleFormat;
    }

    /** {@inheritdoc} */
    includes(vaultPath: string): boolean {
        const [, dir = path.sep, fname = vaultPath] = vaultPath.match(PeriodicLog.VAULT_FILE_PATTERN) ?? [];

        return dir === this.dir && DateTime.fromFormat(fname, this.fileNameFormat + "'.md'").isValid;
    }

    /** {@inheritdoc} */
    getID(): string {
        return this.id;
    }

    /** {@inheritdoc} */
    getSortKey(note: string): string {
        const key = DateTime.fromFormat(note, this.fileNameFormat).toISO();
        if (!key) throw new Error(`failed to parse DateTime("${note}") with "${this.fileNameFormat}"`);
        return key;
    }

    /** {@inheritdoc} */
    getVaultPath(note: string): string {
        return `${this.dir}/${note}`;
    }

    /** {@inheritdoc} */
    getNoteTitle(note: string): string {
        const interval = this.getNoteInterval(note);
        if (!interval.start) throw new Error(`Failed to resolve interval of "${note}"`);
        return interval.start.toFormat(interval.contains(DateTime.now()) ? this.nowTitleFormat : this.titleFormat);
    }

    /** {@inheritdoc} */
    getNoteInterval(note: string): Interval {
        const fileDate = DateTime.fromFormat(note, this.fileNameFormat);
        const start = fileDate.plus(this.offset);
        return Interval.after(start, this.period);
    }

    /** {@inheritdoc} */
    getDataViewSource(): string {
        return `"${this.dir}"`;
    }

    private validate(config: PeriodicLogConfig) {
        if (!config.id) {
            throw new Error(`id is required but got value: ${JSON.stringify(config.id)}`);
        }
        if (!config.dir) {
            throw new Error(`folder is required but got value: ${JSON.stringify(config.dir)}`);
        }
        if (!config.fileNameFormat) {
            throw new Error(`fileNameFormat is required but got value: ${JSON.stringify(config.fileNameFormat)}`);
        }
        if (!config.period) {
            throw new Error(`period is required but got value: ${JSON.stringify(config.period)}`);
        } else {
            this.validateDuration(Duration.fromISO(config.period));
        }
        if (config.offset) {
            this.validateDuration(Duration.fromISO(config.offset));
        }
    }

    private validateDuration(duration: Duration): asserts duration is Duration & { isValid: true } {
        if (!duration.isValid) {
            throw new Error(`${duration.invalidReason}: ${duration.invalidExplanation}`);
        }
    }
}
