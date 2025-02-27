import { MarkdownRenderer } from "obsidian";
import { JSX, createElement } from "preact";
import { FC } from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import { useDebounceValue } from "usehooks-ts";
import { useObsidianBujoContext } from "../bujo-context";

/** Renders the {@link markdown} string with Obsidian's API. */
export const ObsidianMarkdown: FC<ObsidianMarkdownProps> = ({ content, tag = "span" }) => {
    const { plugin, notePath } = useObsidianBujoContext();
    const [html, setHTML] = useState<string>("");

    // Obsidian's API for rendering markdown is asynchronous.
    // As a consequence, there's a risk for "older" renders to resolve *after* "newer" renders.
    // The markdown string is debounced here to avoid this scenario entirely. For now, we'll use the default 500ms.
    const [markdown] = useDebounceValue(content, 500);

    useEffect(() => {
        const resolveHTML = async () => {
            const el = document.createElement("span");
            await MarkdownRenderer.render(plugin.app, markdown, el, notePath, plugin);
            // MarkdownRenderer puts a <p> tag at the root, but I don't want it messing up the page layout,
            // so bypass it by taking *its* innerHTML.
            setHTML((el.firstChild as HTMLParagraphElement).innerHTML);
        };
        resolveHTML();
    }, [markdown, notePath, plugin]);

    return createElement(tag, { dangerouslySetInnerHTML: { __html: html } });
};

/** @see {@link ObsidianMarkdown} */
export interface ObsidianMarkdownProps {
    /** The string to render */
    content: string;
    /** The element to render the markdown within. */
    tag?: keyof JSX.IntrinsicElements;
}
