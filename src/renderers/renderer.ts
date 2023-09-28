import { ReactNode } from "react";

export type RenderFunction = IRenderer["render"];

export interface IRenderer {
    render(el: ReactNode): Promise<void>;
}
