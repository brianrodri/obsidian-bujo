import { ViewContext } from "./view-context";

/** Props accepted by the {@link HeaderView}. */
export type HeaderViewProps = {
    headerLevel?: number;
};

/**
 * Renders the note's header.
 *
 * @example
 * ```markdown
 * # October 2, 2023
 * ```
 */
export function HeaderView({ headerLevel = 2, note, collection }: HeaderViewProps & ViewContext) {
    headerLevel = Math.min(Math.max(headerLevel, 1), 6);
    return `${"#".repeat(headerLevel)} ${collection.getNoteTitle(note)}`;
}
