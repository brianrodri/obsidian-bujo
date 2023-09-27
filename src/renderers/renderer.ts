import { ICollection } from "collections/collection";
import { ReactNode } from "react";

export interface IRenderer {
    getTargetNote(): string;

    getTargetCollection(): ICollection;

    render(el: ReactNode): Promise<void>;
}
