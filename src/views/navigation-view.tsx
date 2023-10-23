import { sortBy, sortedIndexBy } from "lodash";
import { SMarkdownPage } from "obsidian-dataview";
import { FC } from "preact/compat";
import { useCallback, useMemo } from "preact/hooks";
import { useObsidianBujoContext } from "../bujo-context";
import { ObsidianMarkdown } from "../compat/obsidian-markdown";

/** Props accepted by the {@link NavigationView}. */
export interface NavigationViewProps {
    format?: string;
    nowFormat?: string;
    nextFormat?: string;
    prevFormat?: string;
}

/**
 * Gives notes "breadcrumb links" for navigating through their collection.
 *
 * Notes with dates, like daily notes, link to their "closest" date.
 * Otherwise, notes will link to ther next/previous sibling in lexicographical order.
 * The first and final notes will link to each other.
 *
 * @example
 * ```markdown
 * [[2023-09-26]] ← 2023-09-27 → [[2023-10-02]]
 * ```
 */
export const NavigationView: FC<NavigationViewProps> = () => {
    const { dataviewApi, collection, note } = useObsidianBujoContext();

    const bySortKey = useCallback((page: SMarkdownPage) => collection.getSortKey(page.file.name), [collection]);

    const [index, pages] = useMemo(() => {
        const sortedPages = sortBy(dataviewApi.pages(collection.getDataViewSource()), bySortKey);
        const sortedIndex = sortedIndexBy(sortedPages, dataviewApi.page(collection.getVaultPath(note)), bySortKey);
        return [sortedIndex, sortedPages];
    }, [dataviewApi, collection, note, bySortKey]);

    if (pages.length >= 2) {
        const prevOrFinalIndex = (index - 1 + pages.length) % pages.length;
        const nextOrFirstIndex = (index + 1) % pages.length;

        const crumbs = [
            pages[prevOrFinalIndex].file.link,
            index < prevOrFinalIndex ? "↻" : "←",
            note,
            index > nextOrFirstIndex ? "↺" : "→",
            pages[nextOrFirstIndex].file.link,
        ];

        return <ObsidianMarkdown tag="div" content={crumbs.join(" ")} />;
    } else {
        return <>{note}</>;
    }
};
