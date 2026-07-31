import { sealFor, originHue } from "./lore.js";

// Deterministic generative guild seal — the stand-in sigil for entries that
// don't have finished artwork yet.
export default function Seal({ name, number, origin, size = 96 }) {
  const rings = sealFor(name, number);
  const hue = originHue(origin);
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="seal"
      aria-hidden="true"
      style={{ "--seal-hue": hue }}
    >
      <circle cx="50" cy="50" r="46" className="seal-rim" />
      <circle cx="50" cy="50" r="40" className="seal-rim seal-rim--inner" />
      {rings.map((pts, i) => (
        <polygon
          key={i}
          points={pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}
          className={`seal-ring seal-ring--${i}`}
        />
      ))}
      <circle cx="50" cy="50" r="2.4" className="seal-core" />
    </svg>
  );
}
