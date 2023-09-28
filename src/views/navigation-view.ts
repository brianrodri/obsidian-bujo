import { sortBy, sortedIndexBy } from "lodash";
import { SMarkdownPage, getAPI } from "obsidian-dataview";
import { ViewContext } from "views/view-context";

/**
 * Gives notes a breadcrumb-like bar for navigating their collection:
 *
 * ```markdown
 * [[2023-09-26]] ← 2023-09-27 → [[2023-10-02]]
 * ```
 *
 * Usage:
 *     ```bujo
 *     navigation
 *     ```
 *
 * Notes with dates, like daily notes, link to their "nearest" date.
 * Otherwise, notes will link to ther next/previous sibling in lexicographical order.
 * The first and final notes will link to each other.
 */
export function NavigationView({ note, collection }: NavigationViewProps & ViewContext) {
    const api = getAPI()!;
    const page = api.page(collection.getVaultPath(note));
    const pages = api.pages(collection.getDataViewSource());

    if (pages.length < 2) {
        return note;
    }

    const bySortKey = (page: SMarkdownPage) => collection.getSortKey(page.file.name);
    const sortedPages = sortBy(pages, bySortKey) as SMarkdownPage[];
    const noteIndex = sortedIndexBy(sortedPages, page as SMarkdownPage, bySortKey);

    const nextOrFirstIndex = (noteIndex + 1) % sortedPages.length;
    const nextLink = NextLink({ page: sortedPages[nextOrFirstIndex], toFirst: noteIndex > nextOrFirstIndex });

    const prevOrLastIndex = (noteIndex - 1 + sortedPages.length) % sortedPages.length;
    const prevLink = PrevLink({ page: sortedPages[prevOrLastIndex], toLast: noteIndex < prevOrLastIndex });

    return `${prevLink}${note}${nextLink}`;
}

export type NavigationViewProps = NonNullable<unknown>;

/** Renders a pretty link to the next/first note. */
const NextLink = ({ page, toFirst }: { page: SMarkdownPage; toFirst: boolean }) => {
    return ` ${toFirst ? "↺" : "→"} ${page.file.link.markdown()}`;
};

/** Renders a pretty link to the previous/last note. */
const PrevLink = ({ page, toLast }: { page: SMarkdownPage; toLast: boolean }) => {
    return `${page.file.link.markdown()} ${toLast ? "↻" : "←"} `;
};
