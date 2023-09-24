import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { DEFAULT_SETTINGS, ObsidianBujoSettings } from "settings/settings";
import { SettingsManager } from "settings/settings-manager";

const CUSTOM_SETTINGS: ObsidianBujoSettings = {
    collections: {
        periodic: [
            {
                folder: "Logs",
                period: "P1D",
                fileNameFormat: "yyyy-MM-dd",
                titleFormat: "yyyy-MM-dd",
            },
        ],
    },
};

describe("CUSTOM_SETTINGS", () => {
    it("compares unequal to default settings", () => expect(CUSTOM_SETTINGS).not.toEqual(DEFAULT_SETTINGS));
});

describe("SettingsManager", () => {
    const providerMock: jest.Mock<() => Promise<ObsidianBujoSettings>> = jest.fn();
    const consumerMock: jest.Mock<(settings: ObsidianBujoSettings) => Promise<void>> = jest.fn();

    beforeEach(() => {
        providerMock.mockReset();
        consumerMock.mockReset();
    });

    it("starts with default settings", () => {
        const settingsManager = new SettingsManager(providerMock, consumerMock);

        expect(settingsManager.get()).toEqual(DEFAULT_SETTINGS);
        expect(providerMock).not.toHaveBeenCalled();
        expect(consumerMock).not.toHaveBeenCalled();
    });

    it("loads with provider", async () => {
        providerMock.mockResolvedValue(CUSTOM_SETTINGS);

        const settingsManager = new SettingsManager(providerMock, consumerMock);
        await settingsManager.load();

        expect(settingsManager.get()).toEqual(CUSTOM_SETTINGS);
        expect(providerMock).toHaveBeenCalled();
    });

    it("saves with consumer", async () => {
        const settingsManager = new SettingsManager(providerMock, consumerMock);
        await settingsManager.save();

        expect(consumerMock).toHaveBeenCalledWith(settingsManager.get());
    });

    it("updates using deep clone", async () => {
        const settingsManager = new SettingsManager(providerMock, consumerMock);
        settingsManager.update(CUSTOM_SETTINGS);

        expect(settingsManager.get()).toEqual(CUSTOM_SETTINGS);
    });
});
