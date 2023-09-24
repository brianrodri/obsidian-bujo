import { Interval } from "luxon";

/**
 * A Bullet Journal collection.
 *
 * The interface answers the common questions asked by Bullet Journal views:
 * - How do I query for the notes?
 * - Do notes correspond to an interval of time? (e.g. daily notes)
 */
export interface ICollection {
    /** Returns the interval of time corresponding to the given note, or null if not applicable. */
    getInterval(note: string): Interval | null;

    /** Returns the title of the given note. */
    getTitle(note: string): string;

    /** Returns a DataView source that **exclusively** selects every note in the collection. */
    getDataViewSource(): string;
}
