import { PeriodicLogConfig } from "./collections/periodic-log";

export interface ObsidianBujoSettings {
    readonly collections: {
        readonly periodic: readonly PeriodicLogConfig[];
    };
}

export const DEFAULT_SETTINGS: ObsidianBujoSettings = {
    collections: {
        periodic: [
            {
                id: "daily-logs",
                dir: "Daily Logs",
                period: "P1D",
                fileNameFormat: "yyyy-MM-dd",
                titleFormat: "cccc LLLL d, yyyy",
                nowTitleFormat: "'Today'",
            },
            {
                id: "weekly-logs",
                dir: "Weekly Logs",
                period: "P1W",
                fileNameFormat: "kkkk-'W'WW",
                titleFormat: "'Week #'WW",
                nowTitleFormat: "'This Week'",
            },
            {
                id: "monthly-logs",
                dir: "Monthly Logs",
                period: "P1M",
                fileNameFormat: "yyyy-MM",
                titleFormat: "LLLL yyyy",
                nowTitleFormat: "'This Month'",
            },
        ],
    },
};
