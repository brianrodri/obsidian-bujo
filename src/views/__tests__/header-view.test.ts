import { describe, expect, it } from "@jest/globals";
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

    it("calls renderer with the collection-configured note title", () => {
        expect(HeaderView({ ...viewContext, note: "2023-09-26" })).toEqual("# September 26, 2023");
    });

    it("uses different header level when configured", () => {
        expect(HeaderView({ ...viewContext, note: "2023-09-26", headerLevel: 3 })).toEqual("### September 26, 2023");
    });

    it("ignores headerLevel lower than 1", () => {
        expect(HeaderView({ ...viewContext, note: "2023-09-26", headerLevel: 0 })).toEqual("# September 26, 2023");
    });

    it("ignores headerLevel greater than 6", () => {
        expect(HeaderView({ ...viewContext, note: "2023-09-26", headerLevel: 7 })).toEqual("###### September 26, 2023");
    });
});
