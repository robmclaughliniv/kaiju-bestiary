import { useEffect, useState } from "react";
import { imageFor } from "./lore.js";
import { fetchBestiaryEntry, parseBestiaryDetail } from "./bestiary-api.js";
import Markdown from "./Markdown.jsx";
import ScalePanel from "./ScalePanel.jsx";
import DossierHeader from "./dossier/DossierHeader.jsx";
import HeroArt from "./dossier/HeroArt.jsx";
import ProfilePanel from "./dossier/ProfilePanel.jsx";
import ResistancesPanel from "./dossier/ResistancesPanel.jsx";
import StatusPanel from "./dossier/StatusPanel.jsx";
import SkillsPanel from "./dossier/SkillsPanel.jsx";
import DropsPanel from "./dossier/DropsPanel.jsx";
import DossierFooter from "./dossier/DossierFooter.jsx";

function EntryDossier({ entry, entries }) {
  const img = imageFor(entry.number);
  const siblings = entries.filter((e) => e.number === entry.number && e.slug !== entry.slug);
  const idx = entries.findIndex((e) => e.slug === entry.slug);
  const prev = entries[idx - 1];
  const next = entries[idx + 1];
  const num = String(entry.number).padStart(3, "0");
  const [dossierOpen, setDossierOpen] = useState(false);

  return (
    <article className="entry entry--dossier" data-accent={entry.accent || "default"}>
      <div className="entry-nav">
        <a href="#/">← Archive index</a>
        <span>
          {prev && <a href={`#/entry/${prev.slug}`}>← No.{String(prev.number).padStart(3, "0")}</a>}{" "}
          {next && <a href={`#/entry/${next.slug}`}>No.{String(next.number).padStart(3, "0")} →</a>}
        </span>
      </div>

      <DossierHeader entry={entry} num={num} />

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

      <div className="hunt-sheet">
        <div className="hunt-sheet-top">
          <ProfilePanel entry={entry} />
          <HeroArt entry={entry} img={img} />
        </div>

        <div className="hunt-sheet-mid">
          <ResistancesPanel resistances={entry.resistances} />
          <StatusPanel combatProfile={entry.combatProfile} threatAxes={entry.threatAxes} />
        </div>

        <div className="hunt-sheet-bottom">
          <SkillsPanel abilities={entry.abilities} />
          <DropsPanel drops={entry.drops} />
          <ScalePanel scale={entry.scale} lengthMeters={entry.lengthMeters} className="hunt-scale" />
        </div>

        <DossierFooter entry={entry} />
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
