import Tooltip from "./Tooltip.jsx";

export default function DropsPanel({ drops }) {
  if (!drops?.length) return null;

  return (
    <section className="hunt-panel hunt-drops" aria-label="Recoverable materials">
      <h2 className="hunt-panel-title">
        Possible drops <span lang="ja">ドロップ</span>
      </h2>
      <ul className="hunt-drop-list">
        {drops.map((drop) => (
          <li key={drop.name} className={`hunt-drop-row${drop.rare ? " hunt-drop-row--rare" : ""}`}>
            <span className="hunt-drop-icon" aria-hidden="true" />
            <div className="hunt-drop-body">
              <Tooltip label={drop.note || drop.name}>
                <span className="hunt-drop-name">{drop.name}</span>
              </Tooltip>
              {drop.note && <span className="hunt-drop-note">{drop.note}</span>}
            </div>
            {(drop.chance != null || drop.chanceLabel) && (
              <span className="hunt-drop-chance">
                {drop.chance != null ? `${drop.chance}%` : drop.chanceLabel}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
