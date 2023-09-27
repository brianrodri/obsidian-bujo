import { IRenderer } from "renderers/renderer";

export interface IView {
    apply(renderer: IRenderer): Promise<void>;
}
