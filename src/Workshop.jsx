import { useEffect, useState } from "react";
import { fetchCreations } from "./workshop.js";
import Seal from "./Seal.jsx";

function WorkshopCard({ item }) {
  return (
    <a className="card card--workshop" href={`#/workshop/${item.id}`}>
      <div className="card-visual">
        <Seal name={item.name} number={null} origin={item.primaryEcology} size={110} />
      </div>
      <div className="card-body">
        <div className="card-number">
          Workshop
          <span className="card-workshop-tag">community</span>
        </div>
        <h3 className="card-name">{item.name}</h3>
        {item.operationalClass && <p className="card-epithet">{item.operationalClass}</p>}
        <div className="card-tags">
          {item.primaryEcology && <span className="tag tag--origin">{item.primaryEcology}</span>}
          {item.creatorLabel && <span className="tag tag--creator">{item.creatorLabel}</span>}
        </div>
      </div>
    </a>
  );
}

export default function Workshop() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchCreations();
        if (!cancelled) setItems(list);
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load workshop");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="workshop">
      <section className="workshop-intro">
        <p className="workshop-kicker">Community Workshop</p>
        <h1>
          Field dossiers <em>filed in the field</em>
        </h1>
        <p>
          Anonymous creations stored outside the numbered Guild archive. Official
          canon entries still enter through{" "}
          <a href="https://github.com/robmclaughliniv/kaiju-bestiary">GitHub pull requests</a>.
        </p>
        <p className="workshop-cta">
          <a className="workshop-create-link" href="#/create">
            File a new dossier →
          </a>
        </p>
      </section>

      {loading && <p className="workshop-status">Loading workshop entries…</p>}
      {error && <p className="workshop-error">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="workshop-empty">
          No workshop entries yet.{" "}
          <a href="#/create">Be the first to file a dossier</a>.
        </p>
      )}

      <div className="dex-grid">
        {items.map((item) => (
          <WorkshopCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
