import { ICollection } from "collections/collection";
import { Component } from "obsidian";
import { DataviewApi } from "obsidian-dataview";
import { ReactNode } from "react";
import { IRenderer } from "renderers/renderer";

export class DataviewRenderer implements IRenderer {
    constructor(
        private readonly api: DataviewApi,
        private readonly component: Component,
        private readonly container: HTMLElement,
        private readonly note: string,
        private readonly collection: ICollection,
    ) {}

    getTargetNote(): string {
        return this.note;
    }

    getTargetCollection(): ICollection {
        return this.collection;
    }

    async render(el: ReactNode) {
        await this.api.renderValue(el, this.container, this.component, this.collection.getVaultPath(this.note));
    }
}
