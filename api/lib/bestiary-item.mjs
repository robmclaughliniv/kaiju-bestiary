/** Build a DynamoDB item from a parsed bestiary dossier. */

export function bestiaryId(slug) {
  return `bestiary:${slug}`;
}

export function buildBestiaryItem(sourceFile, markdown, parsed) {
  const now = new Date().toISOString();
  return {
    id: bestiaryId(parsed.slug),
    kind: "bestiary",
    slug: parsed.slug,
    number: parsed.number,
    name: parsed.name,
    japaneseName: parsed.japaneseName || null,
    epithet: parsed.epithet || null,
    origin: parsed.origin || null,
    disposition: parsed.disposition || null,
    threat: parsed.threat || null,
    habitat: parsed.habitat || null,
    status: parsed.status || null,
    firstRecord: parsed.firstRecord || null,
    excerpt: parsed.excerpt || parsed.identificationExcerpt || null,
    sourceFile,
    body: markdown,
    updatedAt: now,
  };
}

export function toBestiarySummary(item) {
  return {
    slug: item.slug,
    number: item.number,
    name: item.name,
    japaneseName: item.japaneseName || null,
    epithet: item.epithet || null,
    origin: item.origin || null,
    disposition: item.disposition || null,
    threat: item.threat || null,
    habitat: item.habitat || null,
    status: item.status || null,
    firstRecord: item.firstRecord || null,
    excerpt: item.excerpt || null,
    updatedAt: item.updatedAt || null,
  };
}

export function toBestiaryDetail(item) {
  return {
    ...toBestiarySummary(item),
    body: item.body,
    sourceFile: item.sourceFile || null,
  };
}
