import assert from "assert";
import { sortBy, sortedIndexBy } from "lodash";
import { SMarkdownPage, getAPI } from "obsidian-dataview";
import { FunctionComponent } from "react";
import { ViewContext } from "views/view-context";

export type NavigationViewProps = {
    format?: string;
    nowFormat?: string;
    nextFormat?: string;
    prevFormat?: string;
};

/**
 * Gives notes a breadcrumb-like bar for navigating their collection:
 *
 * Notes with dates, like daily notes, link to their "nearest" date.
 * Otherwise, notes will link to ther next/previous sibling in lexicographical order.
 * The first and final notes will link to each other.
 *
 * @example
 * ```markdown
 * [[2023-09-26]] ← 2023-09-27 → [[2023-10-02]]
 * ```
 */
export const NavigationView: FunctionComponent<NavigationViewProps & ViewContext> = ({ note, collection }) => {
    const api = getAPI();
    assert(api);

    const pages = api.pages(collection.getDataViewSource());
    if (pages.length < 2) {
        return note;
    }

    const bySortKey = (page: SMarkdownPage) => collection.getSortKey(page.file.name);
    const sortedPages = sortBy(pages, bySortKey) as SMarkdownPage[];
    const sortedIndex = sortedIndexBy(sortedPages, api.page(collection.getVaultPath(note)) as SMarkdownPage, bySortKey);

    const nextOrFirstIndex = (sortedIndex + 1) % pages.length;
    const nextLink = NextLink({ page: sortedPages[nextOrFirstIndex], toFirst: sortedIndex > nextOrFirstIndex });

    const prevOrFinalIndex = (sortedIndex - 1 + pages.length) % pages.length;
    const prevLink = PrevLink({ page: sortedPages[prevOrFinalIndex], toFinal: sortedIndex < prevOrFinalIndex });

    return `${prevLink}${note}${nextLink}`;
};

/** Renders a pretty link to the next/first note. */
const NextLink = ({ page, toFirst }: { page: SMarkdownPage; toFirst: boolean }) => {
    return ` ${toFirst ? "↺" : "→"} ${page.file.link.markdown()}`;
};

/** Renders a pretty link to the previous/last note. */
const PrevLink = ({ page, toFinal }: { page: SMarkdownPage; toFinal: boolean }) => {
    return `${page.file.link.markdown()} ${toFinal ? "↻" : "←"} `;
};
