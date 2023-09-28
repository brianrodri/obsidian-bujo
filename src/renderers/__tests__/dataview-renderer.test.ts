import type { Component } from "obsidian";
import { afterAll, afterEach, describe, expect, it, jest } from "@jest/globals";
import { DataviewRenderer } from "renderers/dataview-renderer";
import { getAPI } from "obsidian-dataview";

const mockGetAPI = getAPI as jest.MockedFunction<typeof getAPI>;
const mockRenderValue = jest.fn();

afterEach(() => [mockRenderValue, mockGetAPI].forEach(mock => mock.mockClear()));
afterAll(() => [mockRenderValue, mockGetAPI].forEach(mock => mock.mockRestore()));

jest.mock("obsidian-dataview", () => ({ getAPI: jest.fn(() => ({ renderValue: mockRenderValue })) }));

describe("DataviewRenderer", () => {
    describe(".render()", () => {
        it("calls api.renderValue()", async () => {
            const container = document.createElement("div");
            const component: Component = {} as Component;
            const sourcePath = "Daily Logs/2023-09-27";

            await new DataviewRenderer(component, container, sourcePath).render("test");

            expect(mockRenderValue).toHaveBeenCalledWith("test", container, component, sourcePath);
        });
    });
});
