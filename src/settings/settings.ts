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
                id: "daily-logs",
                folder: "Daily Logs",
                period: "P1D",
                fileNameFormat: "yyyy-MM-dd",
                titleFormat: "yyyy-MM-dd",
            },
            {
                id: "weekly-logs",
                folder: "Weekly Logs",
                period: "P1W",
                fileNameFormat: "kkkk-'W'WW",
                titleFormat: "kkkk-'W'WW",
            },
            {
                id: "monthly-logs",
                folder: "Monthly Logs",
                period: "P1M",
                fileNameFormat: "yyyy-MM",
                titleFormat: "yyyy-MM",
            },
        ],
    },
};
