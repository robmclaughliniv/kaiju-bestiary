import Tooltip from "./Tooltip.jsx";

function StarRating({ value }) {
  if (!value) return null;
  return (
    <span className="hunt-stars" aria-label={`Rarity ${value} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Tooltip key={i} label={i < value ? "Filled star" : "Empty star"}>
          <span className={`hunt-star${i < value ? " hunt-star--on" : ""}`}>★</span>
        </Tooltip>
      ))}
    </span>
  );
}

export default function ProfilePanel({ entry }) {
  const rows = [
    ["Attribute", entry.attribute],
    ["Type", entry.guildType],
    entry.rarity ? ["Rarity", "★"] : null,
    ["Hunt count", entry.documentedHunts],
    [
      "Expedition value",
      entry.expeditionValue ? `${Number(entry.expeditionValue).toLocaleString()} EXP` : null,
    ],
    ["Reward", entry.bounty ? `${Number(entry.bounty).toLocaleString()} G` : null],
    ["Habitat", entry.habitat],
  ].filter(Boolean).filter(([, v]) => v != null && v !== "");

  if (rows.length === 0 && !entry.identificationExcerpt) return null;

  return (
    <section className="hunt-panel hunt-profile">
      <h2 className="hunt-panel-title">Profile</h2>
      {rows.length > 0 && (
        <dl className="hunt-profile-table">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>
                {label === "Rarity" ? <StarRating value={entry.rarity} /> : value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {entry.identificationExcerpt && (
        <p className="hunt-profile-flavor">{entry.identificationExcerpt}</p>
      )}
    </section>
  );
}
