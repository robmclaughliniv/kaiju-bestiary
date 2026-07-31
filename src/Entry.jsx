import { entries, imageFor } from "./lore.js";
import Markdown from "./Markdown.jsx";
import Seal from "./Seal.jsx";

export default function Entry({ entry }) {
  const img = imageFor(entry.number);
  const siblings = entries.filter(
    (e) => e.number === entry.number && e.slug !== entry.slug
  );
  const idx = entries.findIndex((e) => e.slug === entry.slug);
  const prev = entries[idx - 1];
  const next = entries[idx + 1];

  return (
    <article className="entry">
      <div className="entry-nav">
        <a href="#/">← Archive index</a>
        <span>
          {prev && <a href={`#/entry/${prev.slug}`}>← No.{String(prev.number).padStart(3, "0")}</a>}{" "}
          {next && <a href={`#/entry/${next.slug}`}>No.{String(next.number).padStart(3, "0")} →</a>}
        </span>
      </div>

      <header className="entry-head">
        <div className="entry-visual">
          {img ? (
            <img src={img} alt={entry.name} />
          ) : (
            <Seal name={entry.name} number={entry.number} origin={entry.origin} size={220} />
          )}
        </div>
        <div className="entry-ident">
          <div className="entry-number">Bestiary No.{String(entry.number).padStart(3, "0")}</div>
          <h1>{entry.name}</h1>
          {entry.epithet && <p className="entry-epithet">“{entry.epithet}”</p>}
          <dl className="entry-facts">
            {entry.origin && (
              <div>
                <dt>Origin</dt>
                <dd>{entry.origin}</dd>
              </div>
            )}
            {entry.disposition && (
              <div>
                <dt>Disposition</dt>
                <dd>{entry.disposition}</dd>
              </div>
            )}
            {entry.threat && (
              <div>
                <dt>Threat</dt>
                <dd>{entry.threat}</dd>
              </div>
            )}
            {entry.habitat && (
              <div>
                <dt>Range</dt>
                <dd>{entry.habitat}</dd>
              </div>
            )}
            {entry.firstRecord && (
              <div>
                <dt>First record</dt>
                <dd>{entry.firstRecord}</dd>
              </div>
            )}
            {entry.status && (
              <div>
                <dt>Canon status</dt>
                <dd>{entry.status}</dd>
              </div>
            )}
          </dl>
        </div>
      </header>

      {siblings.length > 0 && (
        <aside className="entry-parallel">
          <strong>Parallel records exist for No.{String(entry.number).padStart(3, "0")}.</strong>{" "}
          The archive tracks contradictions rather than erasing them:{" "}
          {siblings.map((s, i) => (
            <span key={s.slug}>
              {i > 0 && ", "}
              <a href={`#/entry/${s.slug}`}>{s.name}</a>
            </span>
          ))}
          .
        </aside>
      )}

      <div className="entry-dossier">
        {/* Epithet and canon status already render in the header above. */}
        <Markdown
          source={entry.markdown.replace(
            /^\*\*(Guild epithet|Canon status):\*\*.*$\n?/gm,
            ""
          )}
        />
      </div>
    </article>
  );
}
