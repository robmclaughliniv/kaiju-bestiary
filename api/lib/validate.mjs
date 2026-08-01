const THREAT_AXES = ["Scale", "Lethality", "Reach", "Persistence", "Intelligence", "Cascade"];

export function validateCreationPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { error: "Body must be a JSON object", status: 400 };
  }

  const name = cleanText(payload.name, 80);
  if (!name || name.length < 2) {
    return { error: "Name is required (2–80 characters)", status: 400 };
  }

  const identification = cleanText(payload.identification, 4000);
  if (!identification || identification.length < 20) {
    return { error: "Identification is required (at least 20 characters)", status: 400 };
  }

  const operationalClass = cleanText(payload.operationalClass, 120) || "Unclassified";
  const primaryEcology = cleanText(payload.primaryEcology, 120) || "Unknown";
  const knownRange = cleanText(payload.knownRange, 200) || "Unverified";
  const creatorLabel = cleanText(payload.creatorLabel, 80) || null;
  const behavior = cleanText(payload.behavior, 4000) || "";
  const ecologicalRole = cleanText(payload.ecologicalRole, 4000) || "";

  const threat = {};
  for (const axis of THREAT_AXES) {
    const key = axis.toLowerCase();
    const raw = payload.threat?.[key] ?? payload.threat?.[axis] ?? 0;
    const rating = Number(raw);
    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      return { error: `Threat axis "${axis}" must be an integer from 0 to 5`, status: 400 };
    }
    threat[key] = rating;
  }

  return {
    data: {
      name,
      identification,
      operationalClass,
      primaryEcology,
      knownRange,
      creatorLabel,
      behavior,
      ecologicalRole,
      threat,
    },
  };
}

function cleanText(value, maxLen) {
  if (value == null) return "";
  const text = String(value).replace(/\r\n/g, "\n").trim();
  if (!text) return "";
  return text.slice(0, maxLen);
}

export { THREAT_AXES };
