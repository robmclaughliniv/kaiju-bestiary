import { useRef } from "react";
import Seal from "../Seal.jsx";
import HazardMeter from "./HazardMeter.jsx";
import { usePrefersReducedMotion } from "./Tooltip.jsx";

export default function HeroArt({ entry, img }) {
  const artRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  function handleMouseMove(e) {
    if (reducedMotion || !artRef.current) return;
    const rect = artRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    artRef.current.style.setProperty("--parallax-x", `${x * 12}px`);
    artRef.current.style.setProperty("--parallax-y", `${y * 8}px`);
  }

  function handleMouseLeave() {
    if (!artRef.current) return;
    artRef.current.style.setProperty("--parallax-x", "0px");
    artRef.current.style.setProperty("--parallax-y", "0px");
  }

  return (
    <figure
      className="hunt-art"
      ref={artRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {!reducedMotion && <div className="hunt-art-particles" aria-hidden="true" />}
      {entry.hazard && (
        <div className="hunt-art-overlay">
          <HazardMeter hazard={entry.hazard} />
        </div>
      )}
      {img ? (
        <img src={img} alt={entry.name} className="hunt-art-img" />
      ) : (
        <div className="dossier-art-fallback">
          <Seal name={entry.name} number={entry.number} origin={entry.origin} size={280} />
        </div>
      )}
    </figure>
  );
}
