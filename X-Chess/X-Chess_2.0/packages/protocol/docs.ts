// The manual, inscribed.
//
// WHY IT IS NOT IN THE BOARD. Two reasons, and the second decided it. The board
// is large already; but more than that, a board is permanent and documentation
// is the thing MOST likely to be wrong. A procedure changes, a field is added, a
// sentence turns out to mislead. Bake the manual into the artefact and every one
// of those is permanent too.
//
// So it is a separate inscription found the way tournaments are found: by the
// wallet it was sent to, newest first. A correction is a new inscription, and
// the board reads it without being rebuilt.
//
// DELIBERATELY NOT HTML, and this is a safety property rather than a taste. The
// docs are discovered by holdings, and anybody may send an inscription to any
// wallet — so a document arriving there is a stranger's until its creator is
// checked. Rendering markup from it would let that stranger put anything on the
// page. The format below is text, the renderer builds nodes from parsed blocks,
// and nothing anywhere does innerHTML.
//
// THE SUBSET IS SMALL ON PURPOSE. Every construct here is a parser that cannot
// be repaired once inscribed, so the test is not "would this be nice" but "can a
// manual be navigated without it". Headings answer where am I, lists answer what
// are the steps, commands answer what do I type, and definitions answer what
// does that word mean. Anything richer is decoration bought at a permanent cost.

/** The first line, exact, so a scan is a string compare. */
export const DOCS_HEADER = 'X-CHESS-DOCS/1';

export type Block =
  | { kind: 'text'; text: string }
  | { kind: 'item'; text: string }
  | { kind: 'command'; text: string }
  | { kind: 'define'; term: string; text: string };

export interface DocSection {
  /** 2 for a section, 3 for one nested inside it. The index nests on this. */
  level: 2 | 3;
  title: string;
  /** Stable id derived from the title, so the index can jump to it. */
  id: string;
  blocks: Block[];
}

export interface Docs {
  title: string;
  /** Anything before the first heading. */
  intro: Block[];
  sections: DocSection[];
}

export interface ParsedDocs {
  ok: boolean;
  docs: Docs | null;
  problem: string | null;
}

/**
 * A heading's id, for the index to link to.
 *
 * Derived from the title rather than authored, because an id nobody typed is an
 * id nobody can get wrong — and a manual that has to keep two lists in step is
 * a manual whose index rots.
 */
export function slug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * Read a docs inscription.
 *
 *   ## Heading          a section
 *   ### Heading         nested inside it
 *   - item              a list item
 *   $ command           something to type, shown as typed
 *   term :: meaning     a glossary entry
 *   anything else       a paragraph, wrapped lines joined
 */
export function parseDocs(text: unknown): ParsedDocs {
  const raw = typeof text === 'string' ? text : '';
  const lines = raw.replace(/\r\n?/g, '\n').split('\n');
  if (lines[0]?.trim() !== DOCS_HEADER) {
    return { ok: false, docs: null, problem: `the first line must be exactly "${DOCS_HEADER}"` };
  }

  const title = (lines[1] ?? '').trim();
  if (!title) return { ok: false, docs: null, problem: 'the second line must be a title' };

  const intro: Block[] = [];
  const sections: DocSection[] = [];
  let blocks = intro;
  let buffer: string[] = [];

  const flush = (): void => {
    const joined = buffer.join(' ').trim();
    if (joined) blocks.push({ kind: 'text', text: joined });
    buffer = [];
  };

  const open = (level: 2 | 3, heading: string): void => {
    flush();
    const section: DocSection = { level, title: heading, id: slug(heading), blocks: [] };
    sections.push(section);
    blocks = section.blocks;
  };

  for (const line of lines.slice(2)) {
    const trimmed = line.trim();

    if (trimmed.startsWith('### ')) {
      open(3, trimmed.slice(4).trim());
      continue;
    }
    if (trimmed.startsWith('## ')) {
      open(2, trimmed.slice(3).trim());
      continue;
    }
    if (!trimmed) {
      flush();
      continue;
    }
    if (trimmed.startsWith('$ ')) {
      flush();
      blocks.push({ kind: 'command', text: trimmed.slice(2).trim() });
      continue;
    }
    if (trimmed.startsWith('- ')) {
      flush();
      blocks.push({ kind: 'item', text: trimmed.slice(2).trim() });
      continue;
    }
    // A definition, but only when the separator is surrounded by text. Bare
    // prose containing a colon pair is far more likely than a glossary line, so
    // the marker is deliberately unusual.
    const define = /^(.{1,60}?)\s::\s(.+)$/.exec(trimmed);
    if (define) {
      flush();
      blocks.push({ kind: 'define', term: define[1].trim(), text: define[2].trim() });
      continue;
    }
    buffer.push(trimmed);
  }
  flush();

  if (!sections.length && !intro.length) {
    return { ok: false, docs: null, problem: 'there is no text in it' };
  }
  // Ids must be unique or the index sends two entries to one place.
  const seen = new Set<string>();
  for (const section of sections) {
    let id = section.id || 'section';
    let n = 2;
    while (seen.has(id)) id = `${section.id}-${n++}`;
    seen.add(id);
    section.id = id;
  }

  return { ok: true, docs: { title, intro, sections }, problem: null };
}

/**
 * Inscription references inside a line, so the board can offer them.
 *
 * `#2991` is how the docs name an inscription, and a reader who cannot click it
 * has to know that Xtrata serves them and where. Returned as pieces rather than
 * markup: the caller builds nodes, because this text is a stranger's until
 * proven otherwise.
 */
export function splitRefs(paragraph: string): Array<{ text: string; inscription: number | null }> {
  const out: Array<{ text: string; inscription: number | null }> = [];
  const pattern = /#(\d{1,7})\b/g;
  let at = 0;
  for (const match of paragraph.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > at) out.push({ text: paragraph.slice(at, start), inscription: null });
    out.push({ text: match[0], inscription: Number(match[1]) });
    at = start + match[0].length;
  }
  if (at < paragraph.length) out.push({ text: paragraph.slice(at), inscription: null });
  return out;
}
