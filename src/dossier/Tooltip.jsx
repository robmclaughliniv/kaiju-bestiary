import { useState, useRef, useEffect } from "react";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

export default function Tooltip({ label, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  return (
    <span
      ref={ref}
      className="tooltip-wrap"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && label && (
        <span className="tooltip-bubble" role="tooltip">
          {label}
        </span>
      )}
    </span>
  );
}
