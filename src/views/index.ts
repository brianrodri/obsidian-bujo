import assert from "assert";
import { isFunction } from "lodash";
import { FunctionComponent } from "react";
import { EnforceKeys } from "utils/type-utils";
import { HeaderView, HeaderViewProps } from "views/header-view";
import { NavigationView, NavigationViewProps } from "views/navigation-view";
import { ViewContext } from "views/view-context";

const VIEW_REGISTRY = {
    header: HeaderView,
    navigation: NavigationView,
} as const satisfies Record<string, FunctionComponent<ViewContext>>;

type ViewPropsRegistry = EnforceKeys<
    typeof VIEW_REGISTRY,
    {
        header: HeaderViewProps;
        navigation: NavigationViewProps;
    }
>;

export type ViewID = keyof typeof VIEW_REGISTRY;
export type ViewProps<ID extends ViewID> = ViewPropsRegistry[ID];

export function View<ID extends ViewID>({ id, ...props }: { id: string } & ViewContext & ViewProps<ID>) {
    assertIsViewID(id);
    const view = VIEW_REGISTRY[id];
    assert(isFunction(view));
    return view(props);
}

export function assertIsViewID(id: string): asserts id is ViewID {
    assert(id in VIEW_REGISTRY);
}
