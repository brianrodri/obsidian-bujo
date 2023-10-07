import { describe, expect, it } from "vitest";
import { PeriodicLog } from "collections/periodic-log";
import { HeaderView } from "views/header-view";
import { ViewContext } from "views/view-context";

describe("HeaderView", () => {
    const viewContext: ViewContext = {
        note: "2023-09-26",
        collection: new PeriodicLog({
            id: "id",
            folder: "folder",
            fileNameFormat: "yyyy-MM-dd",
            titleFormat: "MMMM d, yyyy",
            period: "P1D",
        }),
    };

    it.each([1, 2, 3, 4, 5, 6])("uses headerLevel=%j", headerLevel => {
        expect(HeaderView({ ...viewContext, headerLevel })).toEqual(`${"#".repeat(headerLevel)} September 26, 2023`);
    });

    it("uses headerLevel=2 by default", () => {
        expect(HeaderView({ ...viewContext })).toEqual("## September 26, 2023");
    });

    it("uses headerLevel=1 as lower bound", () => {
        expect(HeaderView({ ...viewContext, headerLevel: 0 })).toEqual("# September 26, 2023");
    });

    it("uses headerLevel=6 as upper bound", () => {
        expect(HeaderView({ ...viewContext, headerLevel: 7 })).toEqual("###### September 26, 2023");
    });
});
