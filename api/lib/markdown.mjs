import { THREAT_AXES } from "./validate.mjs";

export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "kaiju";
}

export function buildMarkdown(data) {
  const threatRows = THREAT_AXES.map((axis) => {
    const rating = data.threat[axis.toLowerCase()] ?? 0;
    return `| ${axis} | ${rating} | |`;
  }).join("\n");

  const sections = [
    `# Workshop — ${data.name}`,
    "",
    "**Canon status:** Community workshop",
    `**Operational class:** ${data.operationalClass}`,
    `**Known range:** ${data.knownRange}`,
    `**Primary ecology:** ${data.primaryEcology}`,
    data.creatorLabel ? `**Filed by:** ${data.creatorLabel}` : null,
    "",
    "## Identification",
    "",
    data.identification,
    "",
    "## Threat assessment",
    "",
    "| Axis | Rating | Notes |",
    "|---|---:|---|",
    threatRows,
    "",
  ];

  if (data.behavior) {
    sections.push("## Behavior", "", data.behavior, "");
  }
  if (data.ecologicalRole) {
    sections.push("## Ecological role", "", data.ecologicalRole, "");
  }

  sections.push(
    "## Canon connections",
    "",
    "- Community workshop entry — not part of the numbered Guild archive.",
    "- May reference established canon regions and organisms in future revisions.",
    ""
  );

  return sections.filter((line) => line !== null).join("\n");
}
