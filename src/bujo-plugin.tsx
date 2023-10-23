import { cloneDeep, merge } from "lodash";
import { Plugin } from "obsidian";
import { render } from "preact";
import { ObsidianBujoContextProvider } from "./bujo-context";
import { ObsidianBujoIndex } from "./bujo-index";
import { DEFAULT_SETTINGS, ObsidianBujoSettings } from "./bujo-settings";
import { ObsidianBujoProcessor } from "./bujo-view";

export default class ObsidianBujoPlugin extends Plugin {
    private _index?: ObsidianBujoIndex;

    get index(): ObsidianBujoIndex {
        if (!this._index) {
            throw new Error("index must be available");
        }
        return this._index;
    }

    override async onload() {
        await this.applySettings(await this.loadData());

        this.registerMarkdownCodeBlockProcessor("bujo", async (codeBlockContent, targetEl, context) => {
            render(
                <ObsidianBujoContextProvider plugin={this} notePath={context.sourcePath}>
                    <ObsidianBujoProcessor bujoCode={codeBlockContent} />
                </ObsidianBujoContextProvider>,
                targetEl,
            );
        });
    }

    private async applySettings(settings: ObsidianBujoSettings) {
        settings = merge(cloneDeep(DEFAULT_SETTINGS), settings);
        this._index = new ObsidianBujoIndex(settings.collections);
    }
}
