import { describe, expect, it, jest } from "@jest/globals";
import { ICollection } from "collections/collection";
import { PeriodicLog } from "collections/periodic-log";
import { Component } from "obsidian";
import { DataviewApi } from "obsidian-dataview";
import { DataviewRenderer } from "renderers/dataview-renderer";

type RenderValueFunc = DataviewApi["renderValue"];

const DAILY_LOGS = new PeriodicLog({
    id: "daily-logs",
    folder: "Daily Logs",
    period: "P1D",
    fileNameFormat: "yyyy-MM-dd",
    titleFormat: "cccc LLLL d, yyyy",
});

const container = document.createElement("div");
const component = {} as Component;

const newDataviewRenderer = (note: string, spy: jest.MockedFunction<RenderValueFunc> = jest.fn()) =>
    new DataviewRenderer({ renderValue: spy } as unknown as DataviewApi, component, container, note, DAILY_LOGS);

describe("DataviewRenderer", () => {
    describe(".render()", () => {
        it("calls api.renderValue()", async () => {
            const spy: jest.MockedFunction<RenderValueFunc> = jest.fn();
            const renderer = newDataviewRenderer("2023-09-27", spy);

            await renderer.render("test");

            expect(spy).toHaveBeenCalledWith("test", container, component, "Daily Logs/2023-09-27");
        });
    });

    describe(".getTarget()", () => {
        it("returns target passed to constructor", () => {
            const renderer = newDataviewRenderer("2023-09-27");

            expect(renderer.getTarget()).toEqual(["2023-09-27", DAILY_LOGS]);
        });
    });
});
