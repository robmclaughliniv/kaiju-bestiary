import { codexDocs } from "./lore.js";
import Markdown from "./Markdown.jsx";

const SECTION_ORDER = ["canon", "world", "guild", "systems", "ecology", "art"];

export default function Codex({ docSlug }) {
  const doc = docSlug ? codexDocs.find((d) => d.slug === docSlug) : null;

  const grouped = SECTION_ORDER.map((dir) => ({
    dir,
    docs: codexDocs.filter((d) => d.dir === dir),
  })).filter((g) => g.docs.length > 0);

  return (
    <div className="codex">
      <nav className="codex-index">
        <h2>The Codex</h2>
        <p className="codex-blurb">Scripture of the world: canon, geography, the Guild, and its systems.</p>
        {grouped.map((g) => (
          <div key={g.dir} className="codex-section">
            <h3>{g.docs[0].section}</h3>
            <ul>
              {g.docs.map((d) => (
                <li key={d.slug}>
                  <a href={`#/codex/${d.slug}`} className={doc?.slug === d.slug ? "active" : ""}>
                    {d.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="codex-reader">
        {doc ? (
          <>
            <h1 className="codex-title">{doc.title}</h1>
            <Markdown source={doc.markdown} />
          </>
        ) : (
          <div className="codex-empty">
            <p>
              Select a text from the index. These documents are authoritative unless
              marked <em>provisional</em>, <em>disputed</em>, or <em>apocryphal</em>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
