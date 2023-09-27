import { DataArray, DataviewApi, SMarkdownPage } from "obsidian-dataview";
import { IRenderer } from "renderers/renderer";
import { IView } from "views/view";

export class NavigationView implements IView {
    constructor(private readonly api: DataviewApi) {}

    async apply(renderer: IRenderer): Promise<void> {
        const [note, collection] = renderer.getTarget();
        const pages = this.api.pages(collection.getDataViewSource()) as DataArray<SMarkdownPage>;
        pages.sortInPlace(page => collection.getNoteInterval(page.file.name)?.toISO());

        const i = pages.findIndex(page => page.file.name === note);
        const curr = i !== -1 ? pages.array()[i].file.name : "";
        const prev = i > 0 ? `${pages.array()[i - 1].file.link.markdown()} ← ` : "";
        const next = i < pages.length - 1 ? ` → ${pages.array()[i + 1].file.link.markdown()}` : "";

        if (prev || next) {
            await renderer.render(`${prev}${curr}${next}`);
        } else {
            await renderer.render(curr);
        }
    }
}
