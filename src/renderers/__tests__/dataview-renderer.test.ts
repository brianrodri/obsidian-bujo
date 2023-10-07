import type { Component } from "obsidian";
import { MockedFunction, afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { DataviewRenderer } from "renderers/dataview-renderer";
import { getAPI } from "obsidian-dataview";

const mockGetAPI = getAPI as MockedFunction<typeof getAPI>;
const mockRenderValue = vi.fn();

afterEach(() => [mockRenderValue, mockGetAPI].forEach(mock => mock.mockClear()));
afterAll(() => [mockRenderValue, mockGetAPI].forEach(mock => mock.mockRestore()));

vi.mock("obsidian-dataview", () => ({ getAPI: vi.fn(() => ({ renderValue: mockRenderValue })) }));

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
