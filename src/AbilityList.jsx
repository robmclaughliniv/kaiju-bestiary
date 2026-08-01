export default function AbilityList({ abilities }) {
  if (!abilities?.length) return null;

  const isFieldGuidance = abilities.every((a) => a.name === "Field guidance");

  return (
    <section className="hud-panel hud-abilities" aria-label={isFieldGuidance ? "Field guidance" : "Recorded abilities"}>
      <h2 className="hud-panel-title">{isFieldGuidance ? "Field guidance" : "Recorded abilities"}</h2>
      <ul className="ability-list">
        {abilities.map((ability, i) => (
          <li key={`${ability.name}-${i}`} className="ability-row">
            {!isFieldGuidance && (
              <span className="ability-index">{String(i + 1).padStart(2, "0")}</span>
            )}
            <div className="ability-body">
              {!isFieldGuidance && <h3 className="ability-name">{ability.name}</h3>}
              <p className="ability-desc">{ability.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
