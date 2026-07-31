// Pure markdown-dossier parsing, shared by the app (src/lore.js) and the
// contribution-validating test suite. No Vite dependencies here.

export function parseMeta(markdown) {
  const meta = {};
  const re = /\*\*([^*:]+):?\*\*:?\s*(.+?)\s*$/gm;
  let m;
  while ((m = re.exec(markdown)) !== null) {
    const key = m[1].trim().replace(/:$/, "").toLowerCase();
    const value = m[2].trim();
    if (!(key in meta)) meta[key] = value;
  }
  return meta;
}

export function parseEntry(path, markdown) {
  const slug = path.split("/").pop().replace(/\.md$/, "");
  const h1 = markdown.match(/^#\s+(.+)$/m);
  const title = h1 ? h1[1].trim() : slug;

  const head = title.match(/Bestiary\s+No\.?\s*(\d+)\s*[:—–-]+\s*(.+)/i);
  const number = head ? parseInt(head[1], 10) : null;
  const name = head ? head[2].trim() : title;

  const meta = parseMeta(markdown);

  // First real paragraph after the metadata block, used as the card excerpt.
  const excerptMatch = markdown
    .split(/\n## /)
    .slice(1)
    .map((section) => {
      const lines = section.split("\n").slice(1).join("\n").trim();
      const para = lines.split(/\n\n/).find(
        (p) => p.trim() && !p.trim().startsWith("-") && !p.trim().startsWith("|") && !p.trim().startsWith("**") && !p.trim().startsWith(">") && !p.trim().startsWith("#")
      );
      return para ? para.replace(/\s+/g, " ").trim() : null;
    })
    .find(Boolean);

  return {
    slug,
    number,
    name,
    epithet: meta["guild epithet"] || meta["operational class"] || null,
    origin: meta["origin"] || meta["primary ecology"] || null,
    disposition: meta["disposition"] || null,
    threat: meta["threat"] || meta["operational class"] || null,
    habitat: meta["primary habitat"] || meta["known range"] || null,
    status: meta["canon status"] || null,
    firstRecord: meta["first verified record"] || null,
    excerpt: excerptMatch || null,
    markdown,
  };
}

