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
        const note = collection.resolveNote(renderer.getTargetNote())!;
        return renderer.render(`${this.markup} ${collection.getNoteTitle(note)}`);
    }
}

export type HeaderViewConfig = {
    headerLevel?: number;
};
