import Tooltip from "./Tooltip.jsx";

export default function HazardMeter({ hazard }) {
  if (!hazard) return null;

  const dots = 5;
  const filled = hazard.value ?? dots;

  return (
    <div className="hunt-hazard" aria-label={`Hazard level: ${hazard.label}`}>
      <span className="hunt-hazard-label">Hazard level</span>
      <Tooltip label={`Guild hazard telemetry: ${hazard.label}`}>
        <div className="hunt-hazard-track">
          {Array.from({ length: dots }, (_, i) => (
            <span
              key={i}
              className={`hunt-hazard-dot${i < filled ? " hunt-hazard-dot--on" : ""}`}
              style={{ "--dot-i": i }}
            />
          ))}
          <span className="hunt-hazard-icon" aria-hidden="true">
            ☠
          </span>
        </div>
      </Tooltip>
      <span className="hunt-hazard-value">{hazard.label}</span>
    </div>
  );
}
