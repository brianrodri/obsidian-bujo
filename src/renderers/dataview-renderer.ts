import assert from "assert";
import { Component } from "obsidian";
import { DataviewApi, getAPI } from "obsidian-dataview";
import { ReactNode } from "react";
import { IRenderer } from "./renderer";

export class DataviewRenderer implements IRenderer {
    private readonly api: DataviewApi;

    constructor(
        private readonly component: Component,
        private readonly container: HTMLElement,
        private readonly sourcePath: string,
    ) {
        const api = getAPI();
        assert(api);
        this.api = api;
    }

    async render(el: ReactNode) {
        await this.api.renderValue(el, this.container, this.component, this.sourcePath);
    }
}
