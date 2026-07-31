import { useEffect, useState } from "react";
import Dex from "./Dex.jsx";
import Entry from "./Entry.jsx";
import Codex from "./Codex.jsx";
import { entries, recordedCount, TOTAL_SLOTS } from "./lore.js";

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

export default function App() {
  const route = useHashRoute();
  const [page, param] = route;

  let view;
  if (page === "entry" && param) {
    const entry = entries.find((e) => e.slug === param);
    view = entry ? <Entry entry={entry} /> : <Dex />;
  } else if (page === "codex") {
    view = <Codex docSlug={param} />;
  } else {
    view = <Dex />;
  }

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
          <a href="#/" className={!page || page === "entry" ? "active" : ""}>
            Bestiary
          </a>
          <a href="#/codex" className={page === "codex" ? "active" : ""}>
            Codex
          </a>
          <span className="masthead-count" title="Recorded dex numbers">
            {String(recordedCount).padStart(3, "0")} / {TOTAL_SLOTS} recorded
          </span>
        </nav>
      </header>
      <main>{view}</main>
      <footer className="colophon">
        <p>
          A living field archive, assembled by imperfect observers. Records may be
          revised, contradicted, censored, or proven wrong.
        </p>
        <p>
          <a
            href="https://github.com/robmclaughliniv/kaiju-bestiary"
            target="_blank"
            rel="noreferrer"
          >
            Contribute a dossier ↗
          </a>
        </p>
      </footer>
    </div>
  );
}
