import { DataArray, DataviewApi, SMarkdownPage } from "obsidian-dataview";
import { IRenderer } from "renderers/renderer";
import { IView } from "views/view";

export class NavigationView implements IView {
    constructor(private readonly api: DataviewApi) {}

    async apply(renderer: IRenderer): Promise<void> {
        const [note, collection] = renderer.getTarget();
        const pages = this.api.pages(collection.getDataViewSource()) as DataArray<SMarkdownPage>;
        pages.sortInPlace(page => collection.getNoteInterval(page.file.name)?.toISO() ?? page.file.name);
        const pageArray = pages.array();

        const i = pageArray.findIndex(page => page.file.name === note);
        const prev = i > 0 ? `${pageArray[i - 1].file.link.markdown()} ← ` : "";
        const next = i < pageArray.length - 1 ? ` → ${pageArray[i + 1].file.link.markdown()}` : "";

        if (prev || next) {
            await renderer.render(`${prev}${note}${next}`);
        } else {
            await renderer.render(note);
        }
    }
}
