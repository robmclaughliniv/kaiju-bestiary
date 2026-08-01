import { useEffect, useState } from "react";
import Markdown from "./Markdown.jsx";
import Seal from "./Seal.jsx";
import ProfilePanel from "./dossier/ProfilePanel.jsx";
import ResistancesPanel from "./dossier/ResistancesPanel.jsx";
import StatusPanel from "./dossier/StatusPanel.jsx";
import SkillsPanel from "./dossier/SkillsPanel.jsx";
import DropsPanel from "./dossier/DropsPanel.jsx";
import DossierFooter from "./dossier/DossierFooter.jsx";
import { fetchCreation, parseWorkshopEntry } from "./workshop.js";

export default function WorkshopEntry({ id }) {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dossierOpen, setDossierOpen] = useState(false);

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

  const workshopEntry = {
    ...entry,
    accent: entry.accent || "default",
    epithet: entry.epithet || "Community filing",
    japaneseName: entry.japaneseName || null,
  };

  return (
    <article className="entry entry--dossier entry--workshop" data-accent={workshopEntry.accent}>
      <div className="entry-nav">
        <a href="#/workshop">← Workshop gallery</a>
        <a href="#/create">File another dossier</a>
      </div>

      <header className="hunt-header">
        <div className="hunt-header-main">
          <p className="dossier-kicker">Community Workshop</p>
          <h1 className="dossier-name">{entry.name}</h1>
          {entry.epithet && <p className="dossier-class">{entry.epithet}</p>}
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

      <div className="hunt-sheet">
        <div className="hunt-sheet-top">
          <ProfilePanel entry={workshopEntry} />
          <figure className="hunt-art">
            <div className="dossier-art-fallback">
              <Seal name={entry.name} number={null} origin={entry.origin} size={280} />
            </div>
          </figure>
        </div>
        <div className="hunt-sheet-mid">
          <ResistancesPanel resistances={entry.resistances} />
          <StatusPanel combatProfile={entry.combatProfile} threatAxes={entry.threatAxes} />
        </div>
        <div className="hunt-sheet-bottom">
          <SkillsPanel abilities={entry.abilities} />
          <DropsPanel drops={entry.drops} />
        </div>
        <DossierFooter entry={workshopEntry} />
      </div>

      {entry.bodyMarkdown && (
        <div className="hunt-dossier-drawer">
          <button
            type="button"
            className="hunt-dossier-toggle"
            aria-expanded={dossierOpen}
            onClick={() => setDossierOpen((o) => !o)}
          >
            {dossierOpen ? "Hide full dossier" : "Open full dossier"}
          </button>
          {dossierOpen && (
            <div className="entry-dossier">
              <Markdown source={entry.bodyMarkdown} />
            </div>
          )}
        </div>
      )}
    </article>
  );
}
