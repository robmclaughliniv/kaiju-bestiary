import Tooltip from "./Tooltip.jsx";

const MODIFIER_LABELS = {
  Weak: "Takes increased damage",
  Neutral: "Standard damage",
  Resist: "Reduced damage",
  Strong: "Heavily reduced damage",
  Absorb: "Absorbs and heals from this type",
};

const MODIFIER_CLASS = {
  Weak: "mod-weak",
  Neutral: "mod-neutral",
  Resist: "mod-resist",
  Strong: "mod-strong",
  Absorb: "mod-absorb",
};

export default function ResistancesPanel({ resistances }) {
  if (!resistances?.length) return null;

  return (
    <section className="hunt-panel hunt-resistances" aria-label="Resistances">
      <h2 className="hunt-panel-title">
        Resistances <span lang="ja">耐性</span>
      </h2>
      <ul className="hunt-resist-grid">
        {resistances.map((row) => (
          <li key={row.type} className="hunt-resist-cell">
            <Tooltip label={MODIFIER_LABELS[row.modifier] || row.modifier}>
              <span className={`hunt-resist-mod ${MODIFIER_CLASS[row.modifier] || ""}`}>
                {row.modifier === "Weak" && "▼"}
                {row.modifier === "Neutral" && "○"}
                {row.modifier === "Resist" && "▲"}
                {row.modifier === "Strong" && "▲▲"}
                {row.modifier === "Absorb" && "◎"}
                {!MODIFIER_CLASS[row.modifier] && "·"}
              </span>
            </Tooltip>
            <span className="hunt-resist-type">{row.type}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
