import { useState } from "react";
import { createCreation, EMPTY_THREAT, THREAT_AXES } from "./workshop.js";

const initialForm = {
  name: "",
  operationalClass: "",
  primaryEcology: "",
  knownRange: "",
  creatorLabel: "",
  identification: "",
  behavior: "",
  ecologicalRole: "",
  threat: { ...EMPTY_THREAT },
};

export default function Create() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [savedId, setSavedId] = useState(null);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateThreat(axis, value) {
    const rating = Number(value);
    setForm((prev) => ({
      ...prev,
      threat: { ...prev.threat, [axis.toLowerCase()]: rating },
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const item = await createCreation(form);
      setSavedId(item.id);
      window.location.hash = `#/workshop/${item.id}`;
    } catch (err) {
      setError(err.message || "Could not save");
    } finally {
      setSubmitting(false);
    }
  }

  if (savedId) {
    return (
      <div className="create">
        <p className="create-success">
          Filed to the Workshop.{" "}
          <a href={`#/workshop/${savedId}`}>View your dossier →</a>
        </p>
      </div>
    );
  }

  return (
    <div className="create">
      <section className="create-intro">
        <p className="create-kicker">Community Workshop</p>
        <h1>File a field dossier</h1>
        <p>
          Workshop entries are separate from the numbered Guild archive. They are
          saved anonymously and appear in the public Workshop gallery.
        </p>
      </section>

      <form className="create-form" onSubmit={onSubmit}>
        <div className="create-grid">
          <label className="create-field create-field--wide">
            <span>Name</span>
            <input
              required
              minLength={2}
              maxLength={80}
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. Glassfin Leviathan"
            />
          </label>

          <label className="create-field">
            <span>Operational class</span>
            <input
              maxLength={120}
              value={form.operationalClass}
              onChange={(e) => updateField("operationalClass", e.target.value)}
              placeholder="e.g. Migratory colossus"
            />
          </label>

          <label className="create-field">
            <span>Primary ecology</span>
            <input
              maxLength={120}
              value={form.primaryEcology}
              onChange={(e) => updateField("primaryEcology", e.target.value)}
              placeholder="e.g. Abyssal / colonial"
            />
          </label>

          <label className="create-field">
            <span>Known range</span>
            <input
              maxLength={200}
              value={form.knownRange}
              onChange={(e) => updateField("knownRange", e.target.value)}
              placeholder="e.g. Outer trench systems"
            />
          </label>

          <label className="create-field">
            <span>Filed by (optional)</span>
            <input
              maxLength={80}
              value={form.creatorLabel}
              onChange={(e) => updateField("creatorLabel", e.target.value)}
              placeholder="Observer name or handle"
            />
          </label>
        </div>

        <label className="create-field create-field--wide">
          <span>Identification</span>
          <textarea
            required
            minLength={20}
            rows={5}
            value={form.identification}
            onChange={(e) => updateField("identification", e.target.value)}
            placeholder="Describe silhouette, scale, movement, residue, and distinguishing signs…"
          />
        </label>

        <fieldset className="create-threat">
          <legend>Threat assessment (0–5)</legend>
          <div className="create-threat-grid">
            {THREAT_AXES.map((axis) => (
              <label key={axis} className="create-threat-axis">
                <span>{axis}</span>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={1}
                  value={form.threat[axis.toLowerCase()]}
                  onChange={(e) => updateThreat(axis, e.target.value)}
                />
              </label>
            ))}
          </div>
        </fieldset>

        <label className="create-field create-field--wide">
          <span>Behavior (optional)</span>
          <textarea
            rows={3}
            value={form.behavior}
            onChange={(e) => updateField("behavior", e.target.value)}
            placeholder="Routine behavior, territoriality, feeding…"
          />
        </label>

        <label className="create-field create-field--wide">
          <span>Ecological role (optional)</span>
          <textarea
            rows={3}
            value={form.ecologicalRole}
            onChange={(e) => updateField("ecologicalRole", e.target.value)}
            placeholder="What the organism consumes, supports, or transforms…"
          />
        </label>

        {error && <p className="create-error">{error}</p>}

        <div className="create-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Filing…" : "File to Workshop"}
          </button>
          <a href="#/workshop">View Workshop gallery</a>
        </div>
      </form>
    </div>
  );
}
