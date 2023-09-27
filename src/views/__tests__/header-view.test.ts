import { describe, expect, it, jest } from "@jest/globals";
import { PeriodicLog } from "collections/periodic-log";
import { HeaderView, HeaderViewConfig, IRenderer } from "views/header-view";

type RenderFunc = IRenderer["render"];

describe("HeaderView", () => {
    const periodicLog = new PeriodicLog({
        id: "id",
        folder: "folder",
        fileNameFormat: "yyyy-MM-dd",
        titleFormat: "MMMM d, yyyy",
        period: "P1D",
    });
    const etc: HeaderViewConfig = {
        headerLevel: undefined,
    };

    it("calls renderer with the collection-configured note title", async () => {
        const spy = jest.fn<RenderFunc>();
        const renderer: IRenderer = {
            getTargetNote: () => "folder/2023-09-26.md",
            getTargetCollection: () => periodicLog,
            render: spy,
        };

        await new HeaderView({ ...etc }).apply(renderer);

        expect(spy).toHaveBeenCalledWith("# September 26, 2023");
    });

    it("uses different header level when configured", async () => {
        const spy = jest.fn<RenderFunc>();
        const renderer: IRenderer = {
            getTargetNote: () => "folder/2023-09-26.md",
            getTargetCollection: () => periodicLog,
            render: spy,
        };

        await new HeaderView({ ...etc, headerLevel: 3 }).apply(renderer);

        expect(spy).toHaveBeenCalledWith("### September 26, 2023");
    });
});
