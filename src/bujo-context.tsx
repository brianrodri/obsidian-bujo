import { DataviewApi, getAPI } from "obsidian-dataview";
import { parse } from "path";
import { createContext } from "preact";
import { FC } from "preact/compat";
import { useContext, useMemo } from "preact/hooks";
import { ObsidianBujoIndex } from "./bujo-index";
import { ICollection } from "./collections/collection";
import ObsidianBujoPlugin from "./bujo-plugin";

/** Provides context for how the plugin is currently being executed. */
export interface ObsidianBujoPluginContext {
    /** API for using Dataview. */
    dataviewApi: DataviewApi;
    /** The pre-configured ObsidianBujo plugin. */
    plugin: ObsidianBujoPlugin;
    /** The path to the note which contains the markdown code block. */
    notePath: string;
    /** The name of the note. */
    note: string;
    /** The collection the note belongs to. */
    collection: ICollection;
}

/** Serves as the empty/default plugin context. */
const EMPTY_PROPS: Readonly<Record<keyof ObsidianBujoPluginContext, undefined>> = {
    plugin: undefined,
    notePath: undefined,
    dataviewApi: undefined,
    collection: undefined,
    note: undefined,
};

const ObsidianContext = createContext<Partial<ObsidianBujoPluginContext>>({});

export function useObsidianBujoContext(): ObsidianBujoPluginContext {
    const props = useContext(ObsidianContext);
    assertPropsAreDefined(props);
    return props;
}

export interface ObsidianContextProviderProps {
    plugin: ObsidianBujoPlugin;
    notePath: string;
}

export const ObsidianBujoContextProvider: FC<ObsidianContextProviderProps> = ({ plugin, notePath, children }) => {
    const dataviewApi = getAPI();
    const [collection, note] = useMemo(() => {
        const collection = plugin.index.getCollections().find(c => c.includes(notePath));
        return collection ? [collection, parse(notePath).name] : [];
    }, [plugin.index, notePath]);

    return (
        <ObsidianContext.Provider value={{ dataviewApi, plugin, notePath, collection, note }}>
            {children}
        </ObsidianContext.Provider>
    );
};

function assertPropsAreDefined(props: Partial<ObsidianBujoPluginContext>): asserts props is ObsidianBujoPluginContext {
    const missingKeys = [];

    for (const [key, value] of Object.entries({ ...EMPTY_PROPS, ...props })) {
        if (!value) {
            missingKeys.push(key);
        }
    }

    if (missingKeys.length > 0) {
        throw new AggregateError(missingKeys, "All props must be defined");
    }
}
