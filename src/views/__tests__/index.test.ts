import { afterAll, afterEach, describe, expect, it, jest } from "@jest/globals";
import { AssertionError } from "assert";
import { ICollection } from "collections/collection";
import { View, ViewID } from "views";
import { HeaderView } from "views/header-view";
import { NavigationView } from "views/navigation-view";

jest.mock("views/header-view", () => ({ HeaderView: jest.fn() }));
jest.mock("views/navigation-view", () => ({ NavigationView: jest.fn() }));

const mockHeaderView = HeaderView as jest.MockedFunction<typeof HeaderView>;
const mockNavigationView = NavigationView as jest.MockedFunction<typeof NavigationView>;

afterEach(() => [mockHeaderView, mockNavigationView].forEach(mock => mock.mockClear()));
afterAll(() => [mockHeaderView, mockNavigationView].forEach(mock => mock.mockRestore()));

describe("View", () => {
    const mockCollection = {} as ICollection;

    it.each([
        ["header" as const, mockHeaderView],
        ["navigation" as const, mockNavigationView],
    ])("resolves a header", (id, expectedMock) => {
        View({ id, note: "2023-09-28", collection: mockCollection });

        expect(expectedMock).toHaveBeenCalled();
    });

    it("rejects invalid id", () => {
        expect(() => View({ id: "💀" as ViewID, note: "2023-09-28", collection: mockCollection })).toThrowError(
            AssertionError,
        );
    });
});
