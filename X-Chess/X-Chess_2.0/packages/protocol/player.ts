// A player naming themselves, and the reason it counts for more than being
// named by somebody else.
//
// INSCRIBING COSTS A SIGNED TRANSACTION. So an inscription made BY an address
// is that key attesting to something, and the check is one read: fetch the
// inscription's creator and compare it to the address the document claims. It
// either matches or the document is a stranger's assertion about somebody.
//
// That gives four sources for a name, ordered by what stands behind them rather
// than by convention:
//
//   BNS name          the registry      ownership, transferable, contestable
//   PLAYER MANIFEST   the wallet        a signature from the key being named
//   tournament        an organiser      a third party's word
//   short address     nobody            it is simply true
//
// A tournament manifest names its entrants, which is what lets "Plumb" appear
// at all — but the organiser wrote that, and the six character sheets at
// 2994-3000 were all inscribed by the Director rather than by the wallets they
// describe. This format is how a wallet says its own name instead.
//
// DELIBERATELY NOT AN ENTRY. `X-CHESS-ENTRY/1` describes a chess personality —
// style, openings, risk appetite — because it is a competitor's submission to a
// tournament. This is identity, and identity should not require anybody to have
// a playing style or to enter anything.

/** The first line, exact, so a scan is a string compare. */
export const PLAYER_HEADER = 'X-CHESS-PLAYER/1';

export const PLAYER_FIELDS = ['address', 'name', 'pronouns', 'about'] as const;
export type PlayerField = (typeof PLAYER_FIELDS)[number];

/**
 * Tight, and tighter than an entry.
 *
 * This is a label beside a game, not a profile page. Every byte is inscribed
 * once and kept forever, and a name that does not fit in a table column is a
 * name the board has to truncate anyway.
 */
export const PLAYER_LIMITS: Record<PlayerField, number> = {
  address: 64,
  name: 24,
  pronouns: 20,
  about: 140
};

export const PLAYER_REQUIRED: PlayerField[] = ['address', 'name'];

export interface Player {
  address: string;
  name: string;
  pronouns?: string;
  about?: string;
}

export interface PlayerProblem {
  field: PlayerField | 'manifest';
  says: string;
}

export interface ParsedPlayer {
  ok: boolean;
  player: Player | null;
  problems: PlayerProblem[];
}

/**
 * Read a player manifest.
 *
 * Same dull `field: value` shape as the entry form, and for the same reason:
 * somebody typing this into a wallet's inscription box should not be able to
 * produce a syntax error. Parsing says nothing about whether the claim is
 * TRUE — see `attested`, which is the half that matters.
 */
export function parsePlayer(text: unknown): ParsedPlayer {
  const raw = typeof text === 'string' ? text : '';
  const lines = raw.replace(/\r\n?/g, '\n').split('\n');
  if (lines[0]?.trim() !== PLAYER_HEADER) {
    return {
      ok: false,
      player: null,
      problems: [{ field: 'manifest', says: `the first line must be exactly "${PLAYER_HEADER}"` }]
    };
  }

  const problems: PlayerProblem[] = [];
  const found: Partial<Record<PlayerField, string>> = {};
  const known = new Set<string>(PLAYER_FIELDS);

  for (const line of lines.slice(1)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const at = line.indexOf(':');
    if (at < 1) {
      problems.push({ field: 'manifest', says: `cannot read this line: ${line.trim().slice(0, 40)}` });
      continue;
    }
    const label = line.slice(0, at).trim().toLowerCase();
    const value = line.slice(at + 1).trim();
    if (!known.has(label)) {
      // Named rather than ignored: an inscription cannot be edited, so somebody
      // who believes a field did something has been misled permanently.
      problems.push({ field: 'manifest', says: `"${label}" is not a field. Allowed: ${PLAYER_FIELDS.join(', ')}` });
      continue;
    }
    const field = label as PlayerField;
    if (found[field] !== undefined) problems.push({ field, says: 'given twice' });
    found[field] = value;
  }

  for (const field of PLAYER_REQUIRED) {
    if (!found[field]?.trim()) problems.push({ field, says: 'is required' });
  }
  for (const field of PLAYER_FIELDS) {
    const value = found[field];
    if (value !== undefined && value.length > PLAYER_LIMITS[field]) {
      problems.push({ field, says: `is ${value.length} characters, and the limit is ${PLAYER_LIMITS[field]}` });
    }
  }
  if (found.address && !/^S[A-Z0-9]{20,50}$/.test(found.address.trim().toUpperCase())) {
    problems.push({ field: 'address', says: 'does not look like a Stacks address' });
  }

  const ok = problems.length === 0;
  return { ok, problems, player: ok ? ({ ...found } as Player) : null };
}

/**
 * Does this manifest actually belong to the address it names?
 *
 * THE WHOLE POINT, and the only thing separating a player manifest from a
 * stranger writing your name down. `creator` comes from the inscription; the
 * address comes from the document; they either match or nothing here counts.
 *
 * Case-insensitive because a Stacks address is case-significant in its checksum
 * but people paste them in either case, and refusing on that would reject a
 * document that is cryptographically fine.
 *
 * Null creator means "could not ask", which is NOT attestation. A reader that
 * cannot check must fall back to the tournament name, never assume.
 */
export function attested(player: Player | null, creator: string | null): boolean {
  if (!player || !creator) return false;
  return player.address.trim().toUpperCase() === creator.trim().toUpperCase();
}

/**
 * The name to show, and where it came from.
 *
 * Ordered by evidence. A caller passes whatever it has and gets back the
 * strongest available, along with the reason — so a board can say WHY somebody
 * is called what they are called, which is the difference between a label and a
 * claim.
 */
export type NameSource = 'bns' | 'player' | 'tournament' | 'address';

export function displayName(options: {
  address: string;
  bns?: string | null;
  /** Only pass this when `attested` returned true for it. */
  player?: string | null;
  tournament?: string | null;
}): { name: string; source: NameSource } {
  if (options.bns) return { name: options.bns, source: 'bns' };
  if (options.player) return { name: options.player, source: 'player' };
  if (options.tournament) return { name: options.tournament, source: 'tournament' };
  const a = options.address;
  return { name: a.length > 12 ? `${a.slice(0, 4)}…${a.slice(-6)}` : a, source: 'address' };
}

/** Why a name reads as it does, for a reader who wants to know. */
export function nameSourceNote(source: NameSource): string {
  if (source === 'bns') return 'a BNS name owned by this address';
  if (source === 'player') return 'inscribed by this address itself';
  if (source === 'tournament') return 'given by the tournament organiser';
  return 'no name has been claimed for this address';
}

/**
 * A manifest ready to inscribe, for an address that wants a name.
 *
 * Built by the board and inscribed by the person, because the board holds no
 * key and never will — it is itself an inscription, and a page that collected
 * one would be wrong forever.
 */
export function buildPlayer(player: Player): string {
  const lines = [PLAYER_HEADER, `address: ${player.address.trim()}`, `name: ${player.name.trim()}`];
  if (player.pronouns?.trim()) lines.push(`pronouns: ${player.pronouns.trim()}`);
  if (player.about?.trim()) lines.push(`about: ${player.about.trim()}`);
  return `${lines.join('\n')}\n`;
}
