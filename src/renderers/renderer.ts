import { ICollection } from "collections/collection";
import { ReactNode } from "react";

export interface IRenderer {
    getTarget(): [string, ICollection];

    render(el: ReactNode): Promise<void>;
}
