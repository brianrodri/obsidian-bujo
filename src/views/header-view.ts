import { ViewContext } from "views/view-context";

export function HeaderView({ headerLevel, note, collection }: HeaderViewProps & ViewContext) {
    headerLevel = Math.max(1, headerLevel ?? 0);
    return `${"#".repeat(headerLevel)} ${collection.getNoteTitle(note)}`;
}

export type HeaderViewProps = {
    headerLevel?: number;
};
