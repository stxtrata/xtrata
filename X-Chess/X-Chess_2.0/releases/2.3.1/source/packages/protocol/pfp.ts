// A wallet pointing at a picture it holds.
//
// SEPARATE FROM THE PLAYER MANIFEST, and this is the whole reason the format
// exists rather than an `image:` line being added to `X-CHESS-PLAYER/1`.
//
// `parsePlayer` refuses a manifest containing any field it does not know, on
// purpose and for a good reason stated there: an inscription cannot be edited,
// so somebody who believes a field did something has been misled permanently.
// The consequence is that a player manifest carrying a new field parses as
// `ok: false` on every board already inscribed — 2988, 3008, 3009, 3014 — and
// those boards would not merely ignore the picture. They would stop showing that
// player's NAME, for ever, on artefacts nobody can correct.
//
// A separate header costs one skipped candidate in a scan that is already
// reading candidates, and costs nothing anywhere else. See
// docs/PLAN-profile-pictures.md.
//
// It is also the same argument `player.ts` makes about itself. It declines to be
// an entry because identity should not require a playing style. A picture is
// decoration and should not require an identity document to be reissued.

/** The first line, exact, so a scan is a string compare. */
export const PFP_HEADER = 'X-CHESS-PFP/1';

export const PFP_FIELDS = ['address', 'image'] as const;
export type PfpField = (typeof PFP_FIELDS)[number];

export interface Pfp {
  address: string;
  /** The inscription to show. */
  image: number;
}

export interface PfpProblem {
  field: PfpField | 'manifest';
  says: string;
}

export interface ParsedPfp {
  ok: boolean;
  problems: PfpProblem[];
  pfp: Pfp | null;
}

/**
 * Image types a picture may be.
 *
 * AN ALLOWLIST, and `image/svg+xml` is deliberately not on it. SVG carries
 * script. An `<img>` element does not execute it in any current browser, so this
 * is not a live hole being closed — it is a refusal to depend on that staying
 * true, and on nobody ever rendering one of these through an `<object>` or a
 * frame later. The cost of the allowlist is nothing; the cost of being wrong
 * about it is a permanent artefact that runs somebody else's code.
 */
export const PICTURE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'] as const;

/**
 * How large a picture may be.
 *
 * Sized for the profile canvas, which shows one at a time. Inscription 3002 is a
 * 443 KB webp and is a perfectly reasonable thing to want as a picture, so a cap
 * tight enough to exclude it would be a cap against real content.
 *
 * The name badges in phase two are a different question with a different answer:
 * one picture per player is fine, and a list rendering ten of them at 443 KB is
 * 4 MB of decode to fill some 24-pixel squares. That is a reason to resize or to
 * bound the badge separately, not a reason to refuse the canvas here.
 */
export const MAX_PICTURE_BYTES = 512 * 1024;

/** What `get-inscription-meta` says, as much of it as a picture cares about. */
export interface InscriptionMeta {
  creator: string | null;
  owner: string | null;
  mime: string | null;
  size: number | null;
  chunks: number | null;
  sealed: boolean;
}

const sameAddress = (a: string | null | undefined, b: string | null | undefined): boolean =>
  Boolean(a && b && String(a).trim().toUpperCase() === String(b).trim().toUpperCase());

/**
 * Whether an inscription can be this address's picture, and why not when it
 * cannot.
 *
 * ONE READ ANSWERS ALL OF IT. `get-inscription-meta` returns creator, owner,
 * mime type and size together, so "is it an image", "does this wallet hold it"
 * and "how big is it" are a single call rather than three. Any version of this
 * that fetches the image before asking is doing avoidable work on a file that
 * may turn out to be 443 KB.
 *
 * HOLDING, NOT CREATING, and this is the one place that differs from a name. A
 * name is checked against the CREATOR because a name that could be transferred
 * could be bought. A picture is decoration: showing one you bought is the normal
 * case, and requiring you to have made it would rule out every piece of art
 * anybody has ever collected.
 */
export function pictureProblem(
  meta: InscriptionMeta | null,
  address: string
): string | null {
  if (!meta) return 'that inscription could not be read, so nothing can be said about it';
  if (!meta.sealed) return 'that inscription is not sealed yet, so its bytes can still change';
  if (!meta.mime) return 'that inscription does not say what type it is';
  if (!(PICTURE_TYPES as readonly string[]).includes(meta.mime.trim().toLowerCase())) {
    return `${meta.mime} is not a picture this board will show. Allowed: ${PICTURE_TYPES.join(', ')}`;
  }
  if (!sameAddress(meta.owner, address)) {
    return 'that inscription is held by somebody else';
  }
  if (typeof meta.size === 'number' && meta.size > MAX_PICTURE_BYTES) {
    return `that inscription is ${Math.round(meta.size / 1024)} KB, and the limit is ${MAX_PICTURE_BYTES / 1024} KB`;
  }
  return null;
}

export function parsePfp(text: unknown): ParsedPfp {
  const problems: PfpProblem[] = [];
  if (typeof text !== 'string' || !text.trim()) {
    return { ok: false, problems: [{ field: 'manifest', says: 'is empty' }], pfp: null };
  }

  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  if (lines[0]?.trim() !== PFP_HEADER) {
    return {
      ok: false,
      problems: [{ field: 'manifest', says: `does not begin ${PFP_HEADER}` }],
      pfp: null
    };
  }

  const known = new Set<string>(PFP_FIELDS);
  const found: Partial<Record<PfpField, string>> = {};

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
      // Named rather than ignored, for the reason player.ts gives: an
      // inscription cannot be edited, so believing a field did something is a
      // permanent mistake.
      problems.push({ field: 'manifest', says: `"${label}" is not a field. Allowed: ${PFP_FIELDS.join(', ')}` });
      continue;
    }
    const field = label as PfpField;
    if (found[field] !== undefined) problems.push({ field, says: 'given twice' });
    found[field] = value;
  }

  for (const field of PFP_FIELDS) {
    if (found[field] === undefined) problems.push({ field, says: 'is required' });
  }
  if (found.address && !/^S[A-Z0-9]{20,50}$/.test(found.address.trim().toUpperCase())) {
    problems.push({ field: 'address', says: 'does not look like a Stacks address' });
  }
  // Whole and positive. A float or a negative reads as a token id nowhere, and
  // an inscription cannot be edited to fix it.
  const image = Number(found.image);
  if (found.image !== undefined && (!Number.isSafeInteger(image) || image < 1)) {
    problems.push({ field: 'image', says: `must be an inscription number, and is ${JSON.stringify(found.image)}` });
  }

  const ok = problems.length === 0;
  return {
    ok,
    problems,
    pfp: ok ? { address: found.address as string, image } : null
  };
}

/**
 * Does this manifest belong to the address it names?
 *
 * The same test `player.ts` applies, and for the same reason: inscribing costs a
 * signed transaction, so a document made BY an address is that key speaking. A
 * picture manifest somebody else inscribed about you is a stranger's assertion,
 * however true it looks.
 */
export function attestedPfp(pfp: Pfp | null, creator: string | null): boolean {
  return Boolean(pfp && sameAddress(pfp.address, creator));
}

/** The manifest text for a wallet to inscribe. */
export function buildPfp(address: string, image: number): string {
  return `${PFP_HEADER}\naddress: ${address.trim()}\nimage: ${image}\n`;
}
