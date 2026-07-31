import { useMemo, useState } from "react";
import { slots, entries, imageFor } from "./lore.js";
import Seal from "./Seal.jsx";

const ORIGINS = [...new Set(entries.flatMap((e) => (e.origin || "").split("/").map((s) => s.trim().split(",")[0]).filter(Boolean)))].sort();

function threatClass(threat) {
  const t = (threat || "").toLowerCase();
  if (t.includes("existential") || t.includes("catastroph") || t.includes("class ø")) return "threat--existential";
  if (t.includes("extreme") || t.includes("class iv")) return "threat--extreme";
  if (t.includes("high") || t.includes("class iii")) return "threat--high";
  if (t.includes("undetermined") || t.includes("unclassifiable") || t.includes("unknown")) return "threat--unknown";
  return "threat--moderate";
}

function RecordCard({ record, disputed }) {
  const img = imageFor(record.number);
  return (
    <a className="card card--recorded" href={`#/entry/${record.slug}`}>
      <div className="card-visual">
        {img ? (
          <img src={img} alt={record.name} loading="lazy" />
        ) : (
          <Seal name={record.name} number={record.number} origin={record.origin} size={110} />
        )}
      </div>
      <div className="card-body">
        <div className="card-number">
          No.{String(record.number).padStart(3, "0")}
          {disputed && <span className="card-disputed" title="Parallel record — the archive tracks contradictions">parallel record</span>}
        </div>
        <h3 className="card-name">{record.name}</h3>
        {record.epithet && <p className="card-epithet">{record.epithet}</p>}
        <div className="card-tags">
          {record.origin && <span className="tag tag--origin">{record.origin}</span>}
          {record.threat && <span className={`tag ${threatClass(record.threat)}`}>{record.threat}</span>}
        </div>
      </div>
    </a>
  );
}

function EmptySlot({ number }) {
  return (
    <div className="card card--empty" title="Unrecorded — contribute this dossier">
      <span className="empty-number">No.{String(number).padStart(3, "0")}</span>
      <span className="empty-label">UNRECORDED</span>
    </div>
  );
}

export default function Dex() {
  const [query, setQuery] = useState("");
  const [origin, setOrigin] = useState("");
  const [showEmpty, setShowEmpty] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return slots.filter((slot) => {
      if (slot.records.length === 0) return showEmpty && !q && !origin;
      return slot.records.some((r) => {
        const matchesQuery =
          !q ||
          r.name.toLowerCase().includes(q) ||
          (r.epithet || "").toLowerCase().includes(q) ||
          (r.habitat || "").toLowerCase().includes(q) ||
          String(r.number).padStart(3, "0").includes(q);
        const matchesOrigin = !origin || (r.origin || "").toLowerCase().includes(origin.toLowerCase());
        return matchesQuery && matchesOrigin;
      });
    });
  }, [query, origin, showEmpty]);

  return (
    <div className="dex">
      <section className="dex-intro">
        <h1>
          Field Archive of <em>Colossal Organisms</em>
        </h1>
        <p>
          Kaiju are not a single species, and not merely giant monsters. The Guild
          records macro-organisms and living phenomena whose scale exceeds every
          conventional ecological category. Two hundred numbered slots. Most remain
          unrecorded. The archive is open.
        </p>
      </section>

      <div className="dex-controls">
        <input
          type="search"
          placeholder="Search name, epithet, habitat, number…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search the bestiary"
        />
        <select value={origin} onChange={(e) => setOrigin(e.target.value)} aria-label="Filter by origin class">
          <option value="">All origins</option>
          {ORIGINS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <label className="dex-toggle">
          <input
            type="checkbox"
            checked={showEmpty}
            onChange={(e) => setShowEmpty(e.target.checked)}
          />
          show unrecorded slots
        </label>
      </div>

      <div className="dex-grid">
        {visible.map((slot) =>
          slot.records.length === 0 ? (
            <EmptySlot key={slot.number} number={slot.number} />
          ) : (
            slot.records.map((r, i) => (
              <RecordCard key={r.slug} record={r} disputed={i > 0} />
            ))
          )
        )}
      </div>
      {visible.length === 0 && (
        <p className="dex-nothing">No records match. The archive keeps its silence.</p>
      )}
    </div>
  );
}
