const LABELS = {
  system: "Theme: System",
  light: "Theme: Light",
  dark: "Theme: Dark",
};

export default function ThemeToggle({ mode, onCycle }) {
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onCycle}
      aria-label={LABELS[mode] || "Toggle theme"}
      title={LABELS[mode]}
    >
      {mode === "system" && (
        <span className="theme-toggle-icon" aria-hidden="true">
          ◐
        </span>
      )}
      {mode === "light" && (
        <span className="theme-toggle-icon" aria-hidden="true">
          ○
        </span>
      )}
      {mode === "dark" && (
        <span className="theme-toggle-icon" aria-hidden="true">
          ●
        </span>
      )}
      <span className="theme-toggle-label">{mode}</span>
    </button>
  );
}
