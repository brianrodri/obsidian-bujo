import { IRenderer } from "./header-view";

export interface IView {
    apply(renderer: IRenderer): Promise<void>;
}
