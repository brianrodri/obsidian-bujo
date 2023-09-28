import { PeriodicLogConfig } from "collections/periodic-log";

export type ObsidianBujoSettings = {
    keyword: string;
    collections: { periodic: PeriodicLogConfig[] };
};

export const DEFAULT_SETTINGS: ObsidianBujoSettings = {
    keyword: "bujo",
    collections: {
        periodic: [
            {
                id: "daily-logs",
                folder: "Daily Logs",
                period: "P1D",
                fileNameFormat: "yyyy-MM-dd",
                titleFormat: "cccc LLLL d, yyyy",
                nowTitleFormat: "'Today'",
            },
            {
                id: "weekly-logs",
                folder: "Weekly Logs",
                period: "P1W",
                fileNameFormat: "kkkk-'W'WW",
                titleFormat: "'Week #'WW",
                nowTitleFormat: "'This Week'",
            },
            {
                id: "monthly-logs",
                folder: "Monthly Logs",
                period: "P1M",
                fileNameFormat: "yyyy-MM",
                titleFormat: "LLLL yyyy",
                nowTitleFormat: "'This Month'",
            },
        ],
    },
};
