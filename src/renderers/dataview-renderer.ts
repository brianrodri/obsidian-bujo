import { Component } from "obsidian";
import { DataviewApi, getAPI } from "obsidian-dataview";
import { ReactNode } from "react";
import { IRenderer } from "renderers/renderer";

export class DataviewRenderer implements IRenderer {
    private readonly api: DataviewApi;

    constructor(
        private readonly component: Component,
        private readonly container: HTMLElement,
        private readonly sourcePath: string,
    ) {
        this.api = getAPI()!;
    }

    async render(el: ReactNode) {
        await this.api.renderValue(el, this.container, this.component, this.sourcePath);
    }
}
