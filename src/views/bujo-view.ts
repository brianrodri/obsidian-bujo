import { AssertionError } from "assert";
import { ViewContext } from "views/view-context";
import { ReactNode } from "react";
import { HeaderView, HeaderViewProps } from "./header-view";
import { NavigationView, NavigationViewProps } from "./navigation-view";
import { EnforceKeys } from "utils/type-utils";

export type ObsidianBujoViewProps = { source?: string };

export function ObsidianBujoView({ source, ...context }: ObsidianBujoViewProps & ViewContext): ReactNode {
    return (source ?? "")
        .split(/\s+/)
        .map(id => View({ id, ...context }))
        .join("\n\n");
}

const VIEW_REGISTRY = { header: HeaderView, navigation: NavigationView } as const;

type ViewRegistry = typeof VIEW_REGISTRY;

type ViewPropsRegistry = EnforceKeys<ViewRegistry, { header: HeaderViewProps; navigation: NavigationViewProps }>;

function assertViewID(id: string): asserts id is keyof ViewRegistry {
    if (id in VIEW_REGISTRY) return;
    const expectedIds = [...Object.keys(VIEW_REGISTRY)];
    throw new AssertionError({
        message: `${id} must be one of: ${expectedIds.join(", ")}`,
        actual: id,
        expected: expectedIds,
        operator: "in",
    });
}

function View<ID extends keyof ViewRegistry>({ id, ...props }: { id?: string } & ViewContext & ViewPropsRegistry[ID]) {
    if (!id) return;
    try {
        assertViewID(id);
        return VIEW_REGISTRY[id](props);
    } catch (error) {
        return `> [!error] ${error}`;
    }
}
