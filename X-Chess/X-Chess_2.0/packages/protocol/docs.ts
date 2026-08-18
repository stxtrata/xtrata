// The manual, inscribed.
//
// WHY IT IS NOT IN THE BOARD. Two reasons, and the second is the one that
// decided it. The board is 193KB and a manual is not small; but more than that,
// a board is permanent and documentation is the thing MOST likely to be wrong.
// A procedure changes, a field is added, a sentence turns out to mislead. Bake
// the manual into the artefact and every one of those is permanent too.
//
// So it is a separate inscription found the way tournaments are found: by the
// wallet it was sent to, newest first. A correction is a new inscription, and
// the board reads it without being rebuilt.
//
// DELIBERATELY NOT HTML, and this is a safety property rather than a taste. The
// docs are discovered by holdings, and anybody may send an inscription to any
// wallet — so a document arriving there is a stranger's until its creator is
// checked. Rendering markup from it would let that stranger put anything on the
// page. The format is text, the renderer builds nodes, and nothing anywhere
// does innerHTML.

/** The first line, exact, so a scan is a string compare. */
export const DOCS_HEADER = 'X-CHESS-DOCS/1';

export interface DocSection {
  /** A `## heading`, or null for the opening text before the first one. */
  title: string | null;
  /** Paragraphs, in order. Blank lines separate them. */
  paragraphs: string[];
}

export interface Docs {
  title: string;
  sections: DocSection[];
}

export interface ParsedDocs {
  ok: boolean;
  docs: Docs | null;
  problem: string | null;
}

/**
 * Read a docs inscription.
 *
 * A tiny subset on purpose: a title, `##` headings, and paragraphs. Anything
 * richer is a parser to maintain forever in an artefact that cannot be
 * repaired, and a manual does not need one.
 */
export function parseDocs(text: unknown): ParsedDocs {
  const raw = typeof text === 'string' ? text : '';
  const lines = raw.replace(/\r\n?/g, '\n').split('\n');
  if (lines[0]?.trim() !== DOCS_HEADER) {
    return { ok: false, docs: null, problem: `the first line must be exactly "${DOCS_HEADER}"` };
  }

  const title = (lines[1] ?? '').trim();
  if (!title) return { ok: false, docs: null, problem: 'the second line must be a title' };

  const sections: DocSection[] = [];
  let current: DocSection = { title: null, paragraphs: [] };
  let buffer: string[] = [];

  const flush = (): void => {
    const joined = buffer.join(' ').trim();
    if (joined) current.paragraphs.push(joined);
    buffer = [];
  };

  for (const line of lines.slice(2)) {
    if (line.startsWith('## ')) {
      flush();
      if (current.title !== null || current.paragraphs.length) sections.push(current);
      current = { title: line.slice(3).trim(), paragraphs: [] };
      continue;
    }
    if (!line.trim()) {
      flush();
      continue;
    }
    buffer.push(line.trim());
  }
  flush();
  if (current.title !== null || current.paragraphs.length) sections.push(current);

  if (!sections.length) return { ok: false, docs: null, problem: 'there is no text in it' };
  return { ok: true, docs: { title, sections }, problem: null };
}

/**
 * Inscription references inside a paragraph, so the board can offer them.
 *
 * `#2991` is how the docs name an inscription, and a reader who cannot click it
 * has to know that xtrata serves them and where. Returned as pieces rather than
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
