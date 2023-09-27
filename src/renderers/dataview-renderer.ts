import { ICollection } from "collections/collection";
import { Component } from "obsidian";
import { DataviewApi } from "obsidian-dataview";
import { ReactNode } from "react";
import { IRenderer } from "renderers/renderer";

export class DataviewRenderer implements IRenderer {
    constructor(
        public readonly api: DataviewApi,
        public readonly component: Component,
        public readonly container: HTMLElement,
        public readonly note: string,
        public readonly collection: ICollection,
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
