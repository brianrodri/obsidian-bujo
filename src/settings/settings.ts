import { PeriodicLogConfig } from "collections/periodic-log";

export type ObsidianBujoSettings = {
    collections: {
        periodic: PeriodicLogConfig[];
    };
};

export const DEFAULT_SETTINGS: ObsidianBujoSettings = {
    collections: {
        periodic: [
            {
                folder: "Daily Logs",
                period: "P1D",
                fileNameFormat: "yyyy-MM-dd",
            },
            {
                folder: "Weekly Logs",
                period: "P1W",
                fileNameFormat: "kkkk-'W'WW",
            },
            {
                folder: "Monthly Logs",
                period: "P1M",
                fileNameFormat: "yyyy-MM",
            },
        ],
    },
};
