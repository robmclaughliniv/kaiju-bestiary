import { useEffect, useState } from "react";
import { imageFor } from "./lore.js";
import { fetchBestiaryEntry, parseBestiaryDetail } from "./bestiary-api.js";
import Markdown from "./Markdown.jsx";
import Seal from "./Seal.jsx";
import ThreatPanel from "./ThreatPanel.jsx";
import AbilityList from "./AbilityList.jsx";
import ScalePanel from "./ScalePanel.jsx";

function IdentityTable({ entry }) {
  const rows = [
    ["Origin", entry.origin],
    ["Disposition", entry.disposition],
    ["Range", entry.habitat],
    ["First record", entry.firstRecord],
    ["Canon status", entry.status],
  ].filter(([, v]) => v);

  if (rows.length === 0) return null;

  return (
    <dl className="hud-identity-table">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function EntryDossier({ entry, entries }) {
  const img = imageFor(entry.number);
  const siblings = entries.filter((e) => e.number === entry.number && e.slug !== entry.slug);
  const idx = entries.findIndex((e) => e.slug === entry.slug);
  const prev = entries[idx - 1];
  const next = entries[idx + 1];
  const num = String(entry.number).padStart(3, "0");

  return (
    <article className="entry entry--dossier">
      <div className="entry-nav">
        <a href="#/">← Archive index</a>
        <span>
          {prev && <a href={`#/entry/${prev.slug}`}>← No.{String(prev.number).padStart(3, "0")}</a>}{" "}
          {next && <a href={`#/entry/${next.slug}`}>No.{String(next.number).padStart(3, "0")} →</a>}
        </span>
      </div>

      <header className="dossier-identity">
        <div className="dossier-identity-text">
          <p className="dossier-kicker">Kaiju Bestiary No.{num}</p>
          <h1 className="dossier-name">{entry.name}</h1>
          {entry.japaneseName && (
            <p className="dossier-jp" lang="ja">
              {entry.japaneseName}
            </p>
          )}
          {entry.epithet && <p className="dossier-class">“{entry.epithet}”</p>}
        </div>
        {entry.threat && (
          <div className="dossier-stamp" aria-label={`Threat: ${entry.threat}`}>
            <span className="dossier-stamp-label">Classification</span>
            <span className="dossier-stamp-value">{entry.threat}</span>
          </div>
        )}
      </header>

      {siblings.length > 0 && (
        <aside className="entry-parallel">
          <strong>Parallel records exist for No.{num}.</strong> The archive tracks
          contradictions rather than erasing them:{" "}
          {siblings.map((s, i) => (
            <span key={s.slug}>
              {i > 0 && ", "}
              <a href={`#/entry/${s.slug}`}>{s.name}</a>
            </span>
          ))}
          .
        </aside>
      )}

      <div className="dossier-hud">
        <div className="dossier-hud-col dossier-hud-col--meta">
          <section className="hud-panel hud-meta">
            <h2 className="hud-panel-title">Identity</h2>
            <IdentityTable entry={entry} />
          </section>

          {entry.identificationExcerpt && (
            <section className="hud-panel hud-flavor">
              <h2 className="hud-panel-title">Identification</h2>
              <p className="hud-flavor-text">{entry.identificationExcerpt}</p>
            </section>
          )}

          <ThreatPanel axes={entry.threatAxes} />
        </div>

        <div className="dossier-hud-col dossier-hud-col--art">
          <figure className="dossier-art">
            {img ? (
              <img src={img} alt={entry.name} />
            ) : (
              <div className="dossier-art-fallback">
                <Seal name={entry.name} number={entry.number} origin={entry.origin} size={280} />
              </div>
            )}
          </figure>
        </div>
      </div>

      <div className="dossier-tactical">
        <AbilityList abilities={entry.abilities} />
        <ScalePanel scale={entry.scale} lengthMeters={entry.lengthMeters} />
      </div>

      {entry.bodyMarkdown && (
        <div className="entry-dossier">
          <Markdown source={entry.bodyMarkdown} />
        </div>
      )}
    </article>
  );
}

export default function Entry({ slug, entries, archiveLoading }) {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setEntry(null);

    fetchBestiaryEntry(slug)
      .then((detail) => {
        if (cancelled) return;
        if (!detail) {
          setError("not_found");
          return;
        }
        setEntry(parseBestiaryDetail(detail));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Could not load entry");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading || archiveLoading) {
    return (
      <div className="entry entry--loading">
        <p className="dex-status">Retrieving dossier No.{slug}…</p>
      </div>
    );
  }

  if (error && error !== "not_found") {
    return (
      <div className="entry entry--error">
        <p className="dex-status dex-status--error">{error}</p>
        <p>
          <a href="#/">← Return to archive index</a>
        </p>
      </div>
    );
  }

  if (error === "not_found" || !entry) {
    return (
      <div className="entry entry--missing">
        <p className="dex-status">No record found for <code>{slug}</code>.</p>
        <p>
          <a href="#/">← Return to archive index</a>
        </p>
      </div>
    );
  }

  return <EntryDossier entry={entry} entries={entries} />;
}
