import { MockedFunction, afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { PeriodicLog } from "collections/periodic-log";
import { getAPI } from "obsidian-dataview";
import { NavigationView } from "views/navigation-view";

vi.mock("obsidian-dataview", () => ({ getAPI: vi.fn(() => ({ page: mockPage, pages: mockPages })) }));

const mockGetAPI = getAPI as MockedFunction<typeof getAPI>;
const mockPage = vi.fn();
const mockPages = vi.fn();

afterEach(() => [mockPages, mockPage, mockGetAPI].forEach(mock => mock.mockClear()));
afterAll(() => [mockPages, mockPage, mockGetAPI].forEach(mock => mock.mockRestore()));

describe("NavigationView", () => {
    const newMockPage = (name: string) => ({ file: { name, link: { markdown: () => `[[${name}]]` } } });

    describe("over Periodic Log", () => {
        const collection = new PeriodicLog({
            id: "daily-notes",
            folder: "Daily Notes",
            fileNameFormat: "yyyy-MM-dd",
            period: "P1D",
            titleFormat: "cccc LLLL d, yyyy",
        });

        it.each([
            { note: "2023-09-27", siblings: [], expected: "2023-09-27" },
            { note: "2023-09-27", siblings: ["2023-09-30"], expected: "[[2023-09-30]] ↻ 2023-09-27 → [[2023-09-30]]" },
            { note: "2023-09-27", siblings: ["2023-07-23"], expected: "[[2023-07-23]] ← 2023-09-27 ↺ [[2023-07-23]]" },
            {
                note: "2024-01-04",
                siblings: [7, 6, 5, 3, 2, 1].map(d => `2024-01-0${d}`),
                expected: "[[2024-01-03]] ← 2024-01-04 → [[2024-01-05]]",
            },
            {
                note: "2023-07-22",
                siblings: ["2023-07-23", "2023-07-21"],
                expected: "[[2023-07-21]] ← 2023-07-22 → [[2023-07-23]]",
            },
        ])("renders $expected for $note when siblings=$siblings", ({ note, siblings, expected }) => {
            mockPage.mockReturnValue(newMockPage(note));
            mockPages.mockReturnValue([note, ...siblings].map(newMockPage));

            expect(NavigationView({ note, collection })).toEqual(expected);
        });
    });
});
