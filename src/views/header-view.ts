import { FunctionComponent, ReactNode } from "react";
import { ViewContext } from "views/view-context";

export type HeaderViewProps = {
    headerLevel?: number;
};

export const HeaderView: FunctionComponent<HeaderViewProps & ViewContext> = ({ headerLevel, note, collection }) => {
    headerLevel = Math.max(1, headerLevel ?? 0);
    return `${"#".repeat(headerLevel)} ${collection.getNoteTitle(note)}` as ReactNode;
};
