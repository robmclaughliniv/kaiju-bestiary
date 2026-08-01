export default function ThreatPanel({ axes, className = "" }) {
  if (!axes?.length) return null;

  return (
    <section className={`hud-panel hud-threat hunt-panel ${className}`.trim()} aria-label="Threat assessment">
      <h2 className="hud-panel-title hunt-panel-title">Threat assessment</h2>
      <ul className="threat-gauges">
        {axes.map((row) => (
          <li key={row.axis} className="threat-gauge">
            <div className="threat-gauge-head">
              <span className="threat-gauge-axis">{row.axis}</span>
              <span className="threat-gauge-val">{row.rating}/5</span>
            </div>
            <div className="threat-gauge-track" aria-hidden="true">
              <div
                className="threat-gauge-fill"
                style={{ "--rating": row.rating }}
              />
            </div>
            {row.notes && <p className="threat-gauge-note">{row.notes}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
