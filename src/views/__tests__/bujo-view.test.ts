import { MockedFunction, afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { ICollection } from "../../collections/collection";
import { HeaderView } from "../header-view";
import { NavigationView } from "../navigation-view";
import { ObsidianBujoView } from "../bujo-view";

vi.mock("../header-view", () => ({ HeaderView: vi.fn() }));
vi.mock("../navigation-view", () => ({ NavigationView: vi.fn() }));

const mockHeaderView = HeaderView as MockedFunction<typeof HeaderView>;
const mockNavigationView = NavigationView as MockedFunction<typeof NavigationView>;

afterEach(() => [mockHeaderView, mockNavigationView].forEach(mock => mock.mockClear()));
afterAll(() => [mockHeaderView, mockNavigationView].forEach(mock => mock.mockRestore()));

const ERROR_OUTPUT_PATTERN = /^> \[!error\] .*$/;

describe("BujoView", () => {
    const mockCollection = {} as ICollection;

    it.each([
        ["header" as const, mockHeaderView],
        ["navigation" as const, mockNavigationView],
    ])("renders view", (source, mockView) => {
        mockView.mockReturnValue("foo");
        expect(ObsidianBujoView({ source, note: "2023-09-28", collection: mockCollection })).toEqual("foo");
        expect(mockView).toHaveBeenCalled();
    });

    it.each([null, undefined, ""] as string[])("renders nothing when source=%j", source => {
        expect(ObsidianBujoView({ source, note: "2023-09-28", collection: mockCollection })).toEqual("");
    });

    it("renders error for invalid ID", () => {
        expect(ObsidianBujoView({ source: "???", note: "2023-09-28", collection: mockCollection })).toMatch(
            ERROR_OUTPUT_PATTERN,
        );
    });
});
