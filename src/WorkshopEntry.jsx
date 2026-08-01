import { useEffect, useState } from "react";
import Markdown from "./Markdown.jsx";
import Seal from "./Seal.jsx";
import ThreatPanel from "./ThreatPanel.jsx";
import AbilityList from "./AbilityList.jsx";
import { fetchCreation, parseWorkshopEntry } from "./workshop.js";

function IdentityTable({ entry }) {
  const rows = [
    ["Origin", entry.origin],
    ["Range", entry.habitat],
    ["Canon status", entry.status],
    ["Filed by", entry.creatorLabel],
    ["Filed", entry.createdAt ? new Date(entry.createdAt).toLocaleString() : null],
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

export default function WorkshopEntry({ id }) {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const detail = await fetchCreation(id);
        if (!detail) {
          if (!cancelled) setError("Workshop entry not found");
          return;
        }
        if (!cancelled) setEntry(parseWorkshopEntry(detail));
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load entry");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <p className="workshop-status">Loading dossier…</p>;
  if (error) {
    return (
      <div className="workshop">
        <p className="workshop-error">{error}</p>
        <a href="#/workshop">← Back to Workshop</a>
      </div>
    );
  }
  if (!entry) return null;

  return (
    <article className="entry entry--dossier entry--workshop">
      <div className="entry-nav">
        <a href="#/workshop">← Workshop gallery</a>
        <a href="#/create">File another dossier</a>
      </div>

      <header className="dossier-identity">
        <div className="dossier-identity-text">
          <p className="dossier-kicker">Community Workshop</p>
          <h1 className="dossier-name">{entry.name}</h1>
          {entry.epithet && <p className="dossier-class">“{entry.epithet}”</p>}
        </div>
        {entry.threat && (
          <div className="dossier-stamp" aria-label={`Classification: ${entry.threat}`}>
            <span className="dossier-stamp-label">Classification</span>
            <span className="dossier-stamp-value">{entry.threat}</span>
          </div>
        )}
      </header>

      <aside className="entry-parallel entry-workshop-note">
        This dossier lives in the community Workshop, not the numbered Guild archive.
        Official canon entries are added via GitHub pull requests.
      </aside>

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
            <div className="dossier-art-fallback">
              <Seal name={entry.name} number={null} origin={entry.origin} size={280} />
            </div>
          </figure>
        </div>
      </div>

      <div className="dossier-tactical">
        <AbilityList abilities={entry.abilities} />
      </div>

      {entry.bodyMarkdown && (
        <div className="entry-dossier">
          <Markdown source={entry.bodyMarkdown} />
        </div>
      )}
    </article>
  );
}
