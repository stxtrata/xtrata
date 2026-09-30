// Deployed-code check for collection contracts.
//
// Creators deploy their collection contract from their own wallet, so the code
// on-chain is whatever they signed. Before Xtrata lists a collection it checks
// that code is exactly an approved template: the only differences allowed are
// the per-collection values the deploy tools fill in (name, price, supply, the
// artist's address, the pinned core...). Each of those lines is matched by a
// strict pattern and replaced with a placeholder; anything else that differs,
// including extra code smuggled onto a value line, changes the fingerprint.
//
// Pure TypeScript with Web Crypto: shared by the studio (browser) and the
// Cloudflare Pages Functions (server).

/** The same compaction the deploy wizard applies before the wallet signs. */
export const compactClaritySource = (source: string) => {
  const compacted: string[] = [];
  for (const line of source.replace(/\r\n?/g, '\n').split('\n')) {
    const withoutIndent = line.replace(/^\s+/, '');
    if (withoutIndent.startsWith(';;')) {
      continue;
    }
    const trimmed = withoutIndent.replace(/\s+$/, '');
    if (trimmed.length > 0) {
      compacted.push(trimmed);
    }
  }
  const result = compacted.join('\n');
  return result.length > 0 ? result : source;
};

// Strict value shapes. A value pattern can never contain a closing paren or an
// unescaped quote, so nothing can be appended after a value on the same line.
const ASCII_STRING = String.raw`"(?:[^"\\\n]|\\.)*"`;
const UINT = String.raw`u\d{1,39}`;
const BOOL = '(?:true|false)';
const STANDARD_PRINCIPAL = String.raw`'S[0-9A-Z]{28,41}`;
const CONTRACT_PRINCIPAL = String.raw`'S[0-9A-Z]{28,41}\.[a-zA-Z][a-zA-Z0-9-]{0,127}`;

type LineRule = { name: string; pattern: RegExp; placeholder: string };

const dataVar = (name: string, type: string, value: string): LineRule => ({
  name,
  pattern: new RegExp(`^\\(define-data-var ${name} ${type} ${value}\\)$`, 'gm'),
  placeholder: `(define-data-var ${name} ${type} <${name}>)`
});

/** Every line a deploy tool is allowed to fill in, across the approved templates. */
const LINE_RULES: LineRule[] = [
  dataVar('collection-name', String.raw`\(string-ascii 64\)`, ASCII_STRING),
  dataVar('collection-symbol', String.raw`\(string-ascii 16\)`, ASCII_STRING),
  dataVar('collection-description', String.raw`\(string-ascii 256\)`, ASCII_STRING),
  dataVar('collection-base-uri', String.raw`\(string-ascii 256\)`, ASCII_STRING),
  dataVar('default-token-uri', String.raw`\(string-ascii 256\)`, `(?:DEFAULT-TOKEN-URI|${ASCII_STRING})`),
  dataVar('default-dependencies', String.raw`\(list 50 uint\)`, String.raw`\(list(?: ${UINT})*\)`),
  dataVar('mint-price', 'uint', UINT),
  dataVar('max-supply', 'uint', UINT),
  dataVar('price', 'uint', UINT),
  dataVar('max-per-wallet', 'uint', UINT),
  dataVar('reservation-expiry-blocks', 'uint', UINT),
  dataVar('paused', 'bool', BOOL),
  dataVar('allowlist-enabled', 'bool', BOOL),
  // v1.7 and earlier (and the pre-inscribed sale): creator-set recipients and splits.
  dataVar('artist-recipient', 'principal', `(?:tx-sender|${STANDARD_PRINCIPAL})`),
  dataVar('marketplace-recipient', 'principal', `(?:tx-sender|${STANDARD_PRINCIPAL})`),
  dataVar('operator-recipient', 'principal', `(?:tx-sender|${STANDARD_PRINCIPAL})`),
  dataVar('artist-bps', 'uint', UINT),
  dataVar('marketplace-bps', 'uint', UINT),
  dataVar('operator-bps', 'uint', UINT),
  // v1.9: the primary artist in the initial artist split (its own line in the template).
  {
    name: 'initial-artist-split',
    pattern: new RegExp(
      `^\\(list \\{ recipient: (?:tx-sender|${STANDARD_PRINCIPAL}), holder-of: none, share: BASIS-POINTS \\}\\)$`,
      'gm'
    ),
    placeholder: '(list { recipient: <artist>, holder-of: none, share: BASIS-POINTS })'
  }
];

const CORE_CONSTANT = new RegExp(
  `^\\(define-constant ALLOWED-XTRATA-CONTRACT (${CONTRACT_PRINCIPAL}|\\.[a-zA-Z][a-zA-Z0-9-]*)\\)$`,
  'gm'
);
// Static calls: the templates only ever call the pinned core this way.
const STATIC_CALL = new RegExp(`\\(contract-call\\? (${CONTRACT_PRINCIPAL}|\\.[a-zA-Z][a-zA-Z0-9-]*) `, 'g');

export type NormalizedCollectionSource = {
  normalized: string;
  /** Every contract the source pins or calls statically, without the leading quote. */
  coreReferences: string[];
};

export const normalizeCollectionSource = (source: string): NormalizedCollectionSource => {
  const coreReferences: string[] = [];
  const unquote = (value: string) => value.replace(/^'/, '');
  let normalized = compactClaritySource(source);
  normalized = normalized.replace(CORE_CONSTANT, (_line, core: string) => {
    coreReferences.push(unquote(core));
    return '(define-constant ALLOWED-XTRATA-CONTRACT <core>)';
  });
  normalized = normalized.replace(STATIC_CALL, (_call, target: string) => {
    coreReferences.push(unquote(target));
    return '(contract-call? <core> ';
  });
  for (const rule of LINE_RULES) {
    normalized = normalized.replace(rule.pattern, rule.placeholder);
  }
  return { normalized, coreReferences };
};

const toHex = (bytes: ArrayBuffer) =>
  Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('');

export const sha256Hex = async (text: string) =>
  toHex(await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));

export const fingerprintCollectionSource = async (source: string) =>
  sha256Hex(normalizeCollectionSource(source).normalized);

/**
 * Fingerprints of the approved templates (see template-fingerprint.test.ts,
 * which recomputes them from contracts/live and fails with the new value when
 * a template changes).
 */
export const COLLECTION_TEMPLATE_FINGERPRINTS = {
  'xtrata-collection-mint-v1.9': 'ac99ee7b181485394cb812a6dfdf7fc056e3b6b31d1bc81b70a2fde949cbed55',
  'xtrata-preinscribed-collection-sale-v1.0': 'a9e129af50825cce46b982f380ecd70bcd35b1f7f9e6bdaac2b3c7e0664af56d'
} as const;

export type ApprovedCollectionTemplate = keyof typeof COLLECTION_TEMPLATE_FINGERPRINTS;

export type CollectionSourceVerdict =
  | { ok: true; template: ApprovedCollectionTemplate }
  | { ok: false; reason: string };

/**
 * Is `source` an approved template, pinned to the core Xtrata expects for that
 * template on this network? `expectedCoreFor` must come from Xtrata's own
 * registry, never from anything the creator supplied.
 */
export const verifyCollectionSource = async (params: {
  source: string;
  expectedCoreFor: (template: ApprovedCollectionTemplate) => string | null;
}): Promise<CollectionSourceVerdict> => {
  const { normalized, coreReferences } = normalizeCollectionSource(params.source);
  const fingerprint = await sha256Hex(normalized);
  const match = (Object.keys(COLLECTION_TEMPLATE_FINGERPRINTS) as ApprovedCollectionTemplate[]).find(
    (template) => COLLECTION_TEMPLATE_FINGERPRINTS[template] === fingerprint
  );
  if (!match) {
    return {
      ok: false,
      reason:
        "This collection's contract code does not match an approved Xtrata template, so it can't be listed. Deploy it again from the collection studio."
    };
  }
  const expected = params.expectedCoreFor(match)?.trim() ?? '';
  if (!expected || coreReferences.length === 0 || coreReferences.some((reference) => reference !== expected)) {
    return {
      ok: false,
      reason: `This collection's contract is not pinned to the Xtrata core${expected ? ` (${expected})` : ''}, so it can't be listed.`
    };
  }
  return { ok: true, template: match };
};
