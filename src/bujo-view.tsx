import { uniq } from "lodash";
import { ComponentType, createElement } from "preact";
import { FC } from "preact/compat";
import { useErrorBoundary } from "preact/hooks";
import { ObsidianMarkdown } from "./compat/obsidian-markdown";
import { HeaderView } from "./views/header-view";
import { NavigationView } from "./views/navigation-view";

/** @see {@link ObsidianBujoProcessor} */
export interface ObsidianBujoProcessorProps {
    /** The content of the markdown block. */
    bujoCode: string;
}

/** {@link import("preact").FunctionComponent} responsible for "replacing" the `bujo` markdown source block. */
export const ObsidianBujoProcessor: FC<ObsidianBujoProcessorProps> = ({ bujoCode }) => {
    const [error] = useErrorBoundary(console.error);
    const props = {}; // TODO: Implement user-defined props.
    const views = uniq(bujoCode.split(/\s+/))
        .filter((id: string): id is keyof typeof VIEW_RECORD => id in VIEW_RECORD)
        .map(id => createElement(VIEW_RECORD[id] as ComponentType, props));

    return error ? <ObsidianMarkdown content={`> [!error] ${error}`} /> : <>{views}</>;
};

/** Source-of-truth for all view identifiers and the components they correspond to. */
const VIEW_RECORD = { header: HeaderView, navigation: NavigationView } as const;
