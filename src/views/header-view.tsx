import { JSX, createElement } from "preact";
import { FC } from "preact/compat";
import { useObsidianBujoContext } from "../bujo-context";

/** @see {@link HeaderView} */
export interface HeaderViewProps {
    tag: keyof JSX.IntrinsicElements;
}

/**
 * Renders the note's header.
 *
 * @example
 * ```markdown
 * # October 2, 2023
 * ```
 */
export const HeaderView: FC<HeaderViewProps> = ({ tag = "h2" }) => {
    const { note, collection } = useObsidianBujoContext();

    return createElement(tag, null, collection?.getNoteTitle(note!));
};
