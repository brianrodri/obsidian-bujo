import { IView } from "views/view";
import { IRenderer } from "renderers/renderer";

export class HeaderView implements IView {
    public readonly markup: string;

    constructor(config: HeaderViewConfig) {
        const headerLevel = Math.max(1, config.headerLevel ?? 0);
        this.markup = "#".repeat(headerLevel);
    }

    async apply(renderer: IRenderer) {
        const collection = renderer.getTargetCollection()!;
        return renderer.render(`${this.markup} ${collection.getNoteTitle(renderer.getTargetNote())}`);
    }
}

export type HeaderViewConfig = {
    headerLevel?: number;
};
