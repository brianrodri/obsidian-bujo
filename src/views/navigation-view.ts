import { DataArray, DataviewApi, SMarkdownPage } from "obsidian-dataview";
import { IRenderer } from "renderers/renderer";
import { IView } from "views/view";

export class NavigationView implements IView {
    constructor(private readonly api: DataviewApi) {}

    async apply(renderer: IRenderer): Promise<void> {
        const [note, collection] = renderer.getTarget();
        const pages = this.api.pages(collection.getDataViewSource()) as DataArray<SMarkdownPage>;
        pages.sortInPlace(page => collection.getNoteInterval(page.file.name)?.toISO() ?? page.file.name);

        const getLink = (index: number) => {
            const page = pages[index] as SMarkdownPage;
            return page.file.link.markdown();
        };

        const i = pages.findIndex(page => page.file.name === note);
        const prev = i > 0 ? `${getLink(i - 1)} ← ` : "";
        const next = i < pages.length - 1 ? ` → ${getLink(i + 1)}` : "";

        if (prev || next) {
            await renderer.render(`${prev}${note}${next}`);
        } else {
            await renderer.render(note);
        }
    }
}
