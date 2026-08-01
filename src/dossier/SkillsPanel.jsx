import { useState } from "react";
import Tooltip from "./Tooltip.jsx";

export default function SkillsPanel({ abilities }) {
  const [expanded, setExpanded] = useState(null);

  if (!abilities?.length) return null;

  const isFieldGuidance = abilities.every((a) => a.name === "Field guidance");
  const title = isFieldGuidance ? "Field guidance" : "Skills";

  return (
    <section className="hunt-panel hunt-skills" aria-label={title}>
      <h2 className="hunt-panel-title">
        {title} {!isFieldGuidance && <span lang="ja">スキル</span>}
      </h2>
      <ul className="hunt-skill-list">
        {abilities.map((ability, i) => {
          const key = `${ability.name}-${i}`;
          const isOpen = expanded === key;

          return (
            <li key={key} className={`hunt-skill-row${ability.ultimate ? " hunt-skill-row--ultimate" : ""}`}>
              {!isFieldGuidance && (
                <span className="hunt-skill-icon" aria-hidden="true" />
              )}
              <button
                type="button"
                className="hunt-skill-trigger"
                aria-expanded={isOpen}
                onClick={() => setExpanded(isOpen ? null : key)}
              >
                <div className="hunt-skill-head">
                  {!isFieldGuidance && (
                    <span className="hunt-skill-name">
                      {ability.name}
                      {ability.japanese && (
                        <span className="hunt-skill-jp" lang="ja">
                          {" "}
                          {ability.japanese}
                        </span>
                      )}
                    </span>
                  )}
                  {ability.ultimate && (
                    <span className="hunt-skill-ultimate" lang="ja">
                      必殺技
                    </span>
                  )}
                  {ability.mp != null && (
                    <Tooltip label="MP cost">
                      <span className="hunt-skill-mp">MP {ability.mp}</span>
                    </Tooltip>
                  )}
                </div>
                <p className={`hunt-skill-desc${isOpen ? " hunt-skill-desc--open" : ""}`}>
                  {ability.description}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
