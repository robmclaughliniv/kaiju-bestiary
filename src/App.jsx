import { useEffect, useState } from "react";
import Dex from "./Dex.jsx";
import Entry from "./Entry.jsx";
import Codex from "./Codex.jsx";
import Create from "./Create.jsx";
import Workshop from "./Workshop.jsx";
import WorkshopEntry from "./WorkshopEntry.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { useTheme } from "./hooks/useTheme.js";
import { useBestiary } from "./useBestiary.js";
import { TOTAL_SLOTS } from "./lore.js";

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => {
      setHash(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  return parts;
}

function ArchiveStatus({ loading, error, recordedCount }) {
  if (loading) {
    return (
      <span className="masthead-count" title="Loading archive">
        … / {TOTAL_SLOTS} recorded
      </span>
    );
  }
  if (error) {
    return (
      <span className="masthead-count masthead-count--error" title={error}>
        archive offline
      </span>
    );
  }
  return (
    <span className="masthead-count" title="Recorded dex numbers">
      {String(recordedCount).padStart(3, "0")} / {TOTAL_SLOTS} recorded
    </span>
  );
}

export default function App() {
  const route = useHashRoute();
  const [page, param] = route;
  const { entries, slots, loading, error, recordedCount } = useBestiary();
  const { mode, cycleMode } = useTheme();

  let view;
  if (page === "entry" && param) {
    view = <Entry slug={param} entries={entries} archiveLoading={loading} />;
  } else if (page === "codex") {
    view = <Codex docSlug={param} />;
  } else if (page === "create") {
    view = <Create />;
  } else if (page === "workshop" && param) {
    view = <WorkshopEntry id={param} />;
  } else if (page === "workshop") {
    view = <Workshop />;
  } else {
    view = <Dex slots={slots} entries={entries} loading={loading} error={error} />;
  }

  const archiveActive = !page || page === "entry";
  const codexActive = page === "codex";
  const workshopActive = page === "workshop" || page === "create";

  return (
    <div className="shell">
      <header className="masthead">
        <a className="masthead-brand" href="#/">
          <span className="masthead-mark" aria-hidden="true">
            ◈
          </span>
          <span>
            <span className="masthead-title">The Kaiju Bestiary</span>
            <span className="masthead-sub">
              Natural Phenomena Preservation Society · Guild Archive
            </span>
          </span>
        </a>
        <nav className="masthead-nav">
          <a href="#/" className={archiveActive ? "active" : ""}>
            Bestiary
          </a>
          <a href="#/workshop" className={workshopActive ? "active" : ""}>
            Workshop
          </a>
          <a href="#/create" className={page === "create" ? "active" : ""}>
            Create
          </a>
          <a href="#/codex" className={codexActive ? "active" : ""}>
            Codex
          </a>
          <ThemeToggle mode={mode} onCycle={cycleMode} />
          <ArchiveStatus loading={loading} error={error} recordedCount={recordedCount} />
        </nav>
      </header>
      <main>{view}</main>
      <footer className="colophon">
        <p>
          A living field archive, assembled by imperfect observers. Records may be
          revised, contradicted, censored, or proven wrong.
        </p>
        <p>
          <a href="#/create">File a workshop dossier</a>
          {" · "}
          <a
            href="https://github.com/robmclaughliniv/kaiju-bestiary"
            target="_blank"
            rel="noreferrer"
          >
            Contribute official canon ↗
          </a>
        </p>
      </footer>
    </div>
  );
}
