import { Interval } from "luxon";

/**
 * A Bullet Journal collection.
 *
 * The interface answers the common questions asked by Bullet Journal views:
 * - How do I query for the notes?
 * - Do notes correspond to an interval of time, like a daily note?
 */
export interface ICollection {
    /** Returns the globally-unique identifier of the collection. */
    getUserDefinedIdentifier(): string;

    /** Returns a sort key for the note. By default, notes are ordered by their names. */
    getSortKey(note: string): string;

    /** Returns the name of the note if the path resolves to this collection. Otherwise returns undefined. */
    resolveNote(notePath: string): string | undefined;

    /** Returns the title of the given note. */
    getNoteTitle(note: string): string;

    /** Returns the interval of time corresponding to the given note, or null if not applicable. */
    getNoteInterval(note: string): Interval | null;

    /** Returns the vault path to the given note (i.e. excludes the file extension). */
    getVaultPath(note: string): string;

    /** Returns a DataView source that selects every note in the collection, and *only* those notes. */
    getDataViewSource(): string;
}
