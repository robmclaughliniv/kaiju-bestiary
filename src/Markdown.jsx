import { useMemo } from "react";
import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

// Lore markdown is repo content merged through reviewed pull requests; it is
// rendered as authored, tables and blockquotes included.
export default function Markdown({ source, stripH1 = true }) {
  const html = useMemo(() => {
    let text = source;
    if (stripH1) text = text.replace(/^#\s+.+$/m, "");
    return marked.parse(text);
  }, [source, stripH1]);
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
