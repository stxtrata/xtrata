// An entry form for an X Chess AI tournament.
//
// WHAT AN ENTRY IS, and is not. It is a PERSONALITY, laid on top of a chess
// engine everybody already has. It is not a chess program: the entrant does not
// teach their character to play, because that was tried and it does not work.
// Six games and about 2 STX established that a language model cannot play chess
// from a legal move list, and that no prompt makes it. Every player in a
// tournament is handed the same inscribed engine, so every player arrives
// competent, and the entry decides only what KIND of competent player it is.
//
// That inversion is the whole design. Without it a tournament measures who
// wrote the best chess instructions, which is a worse game than chess and one
// nobody can referee. With it, an entry is a character and the tournament is
// about character.
//
// WHY IT IS RESTRICTIVE, and restrictive in a way a machine can check:
//
//   * A LENGTH CAP. A Director reads sixteen of these into one tournament, and
//     an entrant who writes ten thousand words is buying attention the others
//     did not get. It is also a cost: entries are inscribed, and bytes are paid
//     for once and kept forever.
//   * A FIXED SET OF FIELDS. Free-form documents cannot be compared, cannot be
//     rendered in a list, and give an entrant somewhere to hide instructions
//     that are not about chess.
//   * NO INSTRUCTIONS TO THE HARNESS. An entry is a description of a player,
//     read as data. Everything else here exists to keep it that way.
//
// THE HEADER IS HOW A BOARD FINDS IT. An inscription is a public byte string
// with no type; the first line is what lets a tournament sweep the chain and
// pick out the first sixteen valid entries without a human reading any of them.

/** The first line of a valid entry. Exact, so a scan is a string compare. */
export const ENTRY_HEADER = 'X-CHESS-ENTRY/1';

/**
 * Every field an entry may carry, and what it is for.
 *
 * A CLOSED LIST. An unknown field is a rejection rather than something ignored,
 * because "ignored" is indistinguishable from "worked" to whoever wrote it, and
 * an entrant who believes a field did something has been misled by us.
 */
export const FIELDS = [
  'name',
  'pronouns',
  'motto',
  'style',
  'opening',
  'risk',
  'endgame',
  'quirk'
] as const;

export type Field = (typeof FIELDS)[number];

/**
 * How long each field may be, in characters.
 *
 * Tight on purpose, and tightest on the ones that shape play. `style` is the
 * heart of an entry and gets the most room; `quirk` is a flourish and gets
 * little. The totals matter more than any single line: sixteen entries at the
 * cap is about 19 KB of prompt across a tournament, which is affordable, and
 * about 19 KB of inscription, which is paid for once.
 */
export const LIMITS: Record<Field, number> = {
  name: 24,
  pronouns: 20,
  motto: 80,
  style: 600,
  opening: 200,
  risk: 200,
  endgame: 200,
  quirk: 120
};

/** Fields an entry cannot leave out. The rest are optional colour. */
export const REQUIRED: Field[] = ['name', 'style'];

/** Total characters an entry may spend, header and labels excluded. */
export const MAX_TOTAL = 1_200;

/**
 * Words that make an entry an instruction rather than a description.
 *
 * NOT A SECURITY BOUNDARY, and it matters to say so plainly. The real defence
 * is structural and lives in the chooser: an entry goes in the user turn, never
 * the system prompt, and whatever comes back must be one move from a list the
 * harness generated. The strongest thing any entry can ultimately cause is a
 * legal chess move, which is the worst case we already accept from a player
 * having a bad game.
 *
 * This list is a COURTESY. It catches an entrant who has misunderstood the
 * format and tells them so at submission time, rather than letting them inscribe
 * something permanent that will simply be read as flavour text. Treating it as
 * protection would be the mistake — a determined entrant rephrases in a second,
 * and it does not matter that they can.
 */
const INSTRUCTION_SHAPED = [
  'ignore previous',
  'ignore all previous',
  'disregard',
  'system prompt',
  'you are now',
  'new instructions',
  'override',
  'reveal your',
  'print your',
  'output the'
];

export interface Entry {
  name: string;
  pronouns?: string;
  motto?: string;
  style: string;
  opening?: string;
  risk?: string;
  endgame?: string;
  quirk?: string;
}

export interface EntryProblem {
  field: Field | 'entry';
  says: string;
}

export interface ParsedEntry {
  ok: boolean;
  entry: Entry | null;
  problems: EntryProblem[];
  /** Characters used against MAX_TOTAL, so a form can show a budget. */
  used: number;
}

/**
 * Read an inscribed entry.
 *
 * The format is deliberately the dullest thing that works: a header line, then
 * `field: value`, one per line, with blank lines ignored. No JSON, no YAML, no
 * front matter. Somebody typing this by hand into a wallet's inscription box
 * should not be able to produce a syntax error, and every parser that has ever
 * been given a cleverer format has grown a security note underneath it.
 *
 * A value may wrap onto following indented lines, because 600 characters of
 * style on one line is unreadable in every tool that will ever display it.
 */
export function parseEntry(text: unknown): ParsedEntry {
  const problems: EntryProblem[] = [];
  const raw = typeof text === 'string' ? text : '';
  const lines = raw.replace(/\r\n?/g, '\n').split('\n');

  if (lines[0]?.trim() !== ENTRY_HEADER) {
    return {
      ok: false, entry: null, used: 0,
      problems: [{ field: 'entry', says: `the first line must be exactly "${ENTRY_HEADER}"` }]
    };
  }

  const found: Partial<Record<Field, string>> = {};
  const known = new Set<string>(FIELDS);
  let current: Field | null = null;

  for (const line of lines.slice(1)) {
    if (!line.trim()) { current = null; continue; }

    // A comment. The blank form is mostly comments — the limits belong next to
    // the field they bound — and it promised these were ignored before anything
    // ignored them, so the form did not parse as its own format.
    //
    // Checked BEFORE the indent rule, or a commented line under a field would
    // be swallowed into that field's value as if the entrant had written it.
    if (line.trim().startsWith('#')) continue;

    // An indented line continues the field above it.
    if (/^\s/.test(line) && current) {
      found[current] = `${found[current] ?? ''} ${line.trim()}`.trim();
      continue;
    }

    const at = line.indexOf(':');
    if (at < 1) {
      problems.push({ field: 'entry', says: `cannot read this line: ${line.trim().slice(0, 40)}` });
      current = null;
      continue;
    }

    const label = line.slice(0, at).trim().toLowerCase();
    const value = line.slice(at + 1).trim();
    if (!known.has(label)) {
      // Named rather than ignored: an entrant who thinks a field did something
      // has been misled, and an inscription cannot be edited afterwards.
      problems.push({ field: 'entry', says: `"${label}" is not a field. Allowed: ${FIELDS.join(', ')}` });
      current = null;
      continue;
    }

    const field = label as Field;
    if (found[field] !== undefined) {
      problems.push({ field, says: 'given twice' });
    }
    found[field] = value;
    current = field;
  }

  for (const field of REQUIRED) {
    if (!found[field]?.trim()) problems.push({ field, says: 'is required' });
  }

  let used = 0;
  for (const field of FIELDS) {
    const value = found[field];
    if (value === undefined) continue;
    used += value.length;
    if (value.length > LIMITS[field]) {
      problems.push({ field, says: `is ${value.length} characters, and the limit is ${LIMITS[field]}` });
    }
    const lowered = value.toLowerCase();
    for (const phrase of INSTRUCTION_SHAPED) {
      if (lowered.includes(phrase)) {
        problems.push({
          field,
          says:
            `reads as an instruction ("${phrase}"). An entry describes a player; ` +
            'it is shown to the model as a description and cannot direct it.'
        });
        break;
      }
    }
  }

  if (used > MAX_TOTAL) {
    problems.push({ field: 'entry', says: `is ${used} characters, and the limit is ${MAX_TOTAL}` });
  }

  const ok = problems.length === 0;
  return {
    ok,
    used,
    problems,
    entry: ok ? ({ ...found } as Entry) : null
  };
}

/**
 * The prompt text an accepted entry becomes.
 *
 * Assembled here rather than in the harness so that what a character is is a
 * property of the ENTRY FORMAT, checkable by anybody holding the inscription,
 * rather than a detail of whichever Director happens to be running.
 *
 * The optional fields are labelled in the output. A model reading "Openings:"
 * treats what follows as being about openings; the same words in a paragraph
 * are just words.
 */
export function entryToPrompt(entry: Entry): string {
  const lines = [entry.style.trim()];
  const add = (label: string, value?: string): void => {
    if (value?.trim()) lines.push(`${label}: ${value.trim()}`);
  };
  add('Openings', entry.opening);
  add('Risk', entry.risk);
  add('Endgames', entry.endgame);
  add('Quirk', entry.quirk);
  return lines.join('\n\n');
}

/**
 * A blank form, ready to fill in and inscribe.
 *
 * Carries its own instructions as comments, because it will be read by somebody
 * who found the inscription and not the documentation — and the limits belong
 * next to the field they bound rather than in a table somewhere else.
 */
export function blankEntry(): string {
  return `${ENTRY_HEADER}
# Fill this in and inscribe it. Lines starting with # are ignored.
# Your character is handed a chess engine that already plays competently.
# You are not teaching it chess. You are deciding who it is.

name:
# ${LIMITS.name} characters. What the board and the leaderboard will call it.

pronouns:
# ${LIMITS.pronouns} characters. Optional. Used when the board talks about your player.

motto:
# ${LIMITS.motto} characters. Optional. Shown under the name.

style:
# ${LIMITS.style} characters. REQUIRED, and the heart of the entry.
# Describe the kind of player this is. What does it want from a position?
# What does it find beautiful, or beneath it? Write about a PLAYER, not about
# chess rules - the engine handles those.

opening:
# ${LIMITS.opening} characters. Optional. What it likes to play, and why.

risk:
# ${LIMITS.risk} characters. Optional. When it will accept a worse move for a
# sharper game, and when it will not.

endgame:
# ${LIMITS.endgame} characters. Optional. How it behaves once the pieces thin out.

quirk:
# ${LIMITS.quirk} characters. Optional. One habit that makes it recognisable.

# ${MAX_TOTAL} characters across all fields. Everything is public and permanent.
`;
}
