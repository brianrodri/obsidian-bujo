import { PeriodicLogConfig } from "collections/periodic-log";

export type ObsidianBujoSettings = {
    collections: {
        periodic: PeriodicLogConfig[];
    };
};

export const DEFAULT_SETTINGS: ObsidianBujoSettings = {
    collections: {
        periodic: [],
    },
};
