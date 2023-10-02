import { FunctionComponent, ReactNode } from "react";
import { ViewContext } from "views/view-context";

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
export const HeaderView: FunctionComponent<HeaderViewProps & ViewContext> = ({ headerLevel = 1, note, collection }) => {
    headerLevel = Math.min(Math.max(headerLevel, 1), 6);
    return `${"#".repeat(headerLevel)} ${collection.getNoteTitle(note)}` as ReactNode;
};
