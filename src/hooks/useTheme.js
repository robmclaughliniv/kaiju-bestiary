import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "kb-theme";
const MODES = ["system", "light", "dark"];

function getStoredMode() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (MODES.includes(stored)) return stored;
  } catch {
    /* ignore */
  }
  return "system";
}

function resolveTheme(mode) {
  if (mode === "light") return "light";
  if (mode === "dark") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(resolved) {
  document.documentElement.setAttribute("data-theme", resolved);
}

export function initTheme() {
  const mode = getStoredMode();
  applyTheme(resolveTheme(mode));
}

export function useTheme() {
  const [mode, setModeState] = useState(getStoredMode);
  const [resolved, setResolved] = useState(() => resolveTheme(getStoredMode()));

  useEffect(() => {
    const next = resolveTheme(mode);
    setResolved(next);
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  useEffect(() => {
    if (mode !== "system") return undefined;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const next = resolveTheme("system");
      setResolved(next);
      applyTheme(next);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);

  const cycleMode = useCallback(() => {
    setModeState((current) => {
      const idx = MODES.indexOf(current);
      return MODES[(idx + 1) % MODES.length];
    });
  }, []);

  return { mode, resolved, cycleMode };
}
