import Tooltip from "./Tooltip.jsx";
import ThreatPanel from "../ThreatPanel.jsx";

const COMBAT_KEYS = [
  ["level", "Level", 100],
  ["hp", "HP", 100000],
  ["mp", "MP", 1000],
  ["attack", "Attack", 999],
  ["defense", "Defense", 999],
  ["magic attack", "Magic Atk", 999],
  ["magic defense", "Magic Def", 999],
  ["agility", "Agility", 999],
  ["accuracy", "Accuracy", 999],
  ["evasion", "Evasion", 999],
];

function CombatBar({ label, value, max }) {
  const num = typeof value === "number" ? value : parseInt(String(value).replace(/,/g, ""), 10);
  const pct = Number.isNaN(num) ? 50 : Math.min(100, (num / max) * 100);

  return (
    <li className="hunt-stat-row">
      <Tooltip label={`${label}: ${value}`}>
        <div className="hunt-stat-head">
          <span className="hunt-stat-label">{label}</span>
          <span className="hunt-stat-val">{typeof value === "number" ? value.toLocaleString() : value}</span>
        </div>
        <div className="hunt-stat-track" aria-hidden="true">
          <div className="hunt-stat-fill" style={{ "--pct": pct }} />
        </div>
      </Tooltip>
    </li>
  );
}

function CombatProfile({ profile }) {
  const level = profile.level;
  const hp = profile.hp;
  const mp = profile.mp;

  return (
    <section className="hunt-panel hunt-status" aria-label="Combat profile">
      <h2 className="hunt-panel-title">
        Status <span lang="ja">ステータス</span>
        {level != null && <span className="hunt-level">Lv. {level}</span>}
      </h2>
      {(hp != null || mp != null) && (
        <div className="hunt-vitals">
          {hp != null && (
            <div className="hunt-vital hunt-vital--hp">
              <span className="hunt-vital-label">HP</span>
              <div className="hunt-vital-track">
                <div className="hunt-vital-fill hunt-vital-fill--hp" style={{ width: "100%" }} />
              </div>
              <span className="hunt-vital-val">{typeof hp === "number" ? hp.toLocaleString() : hp}</span>
            </div>
          )}
          {mp != null && (
            <div className="hunt-vital hunt-vital--mp">
              <span className="hunt-vital-label">MP</span>
              <div className="hunt-vital-track">
                <div className="hunt-vital-fill hunt-vital-fill--mp" style={{ width: "100%" }} />
              </div>
              <span className="hunt-vital-val">{typeof mp === "number" ? mp.toLocaleString() : mp}</span>
            </div>
          )}
        </div>
      )}
      <ul className="hunt-stat-list">
        {COMBAT_KEYS.filter(([key]) => key !== "level" && key !== "hp" && key !== "mp" && profile[key] != null).map(
          ([key, label, max]) => (
            <CombatBar key={key} label={label} value={profile[key]} max={max} />
          )
        )}
      </ul>
    </section>
  );
}

export default function StatusPanel({ combatProfile, threatAxes }) {
  if (!combatProfile && !threatAxes?.length) return null;

  return (
    <div className="hunt-status-stack">
      {combatProfile && <CombatProfile profile={combatProfile} />}
      {threatAxes?.length && (
        <ThreatPanel axes={threatAxes} className="hunt-threat-fallback hunt-threat-inline" />
      )}
    </div>
  );
}
