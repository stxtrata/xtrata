// Forever Twins helper adapter: one read/write surface over v1 (live, pre-grant) and v3 helpers.
// Pure ES module. All chain access goes through injected functions so it can be tested in Node:
//   read(contractId, functionName, args) -> plain JS value (uints as strings, tuples as objects,
//                                           {ok}/{err} responses, {some} optionals decoded by unwrap*)
//   cl = { uint(n), principal(p), buffer(bytes), list(items) }  (Clarity value builders)

export const CHUNK_SIZE = 16384;
export const MAX_CHUNKS = 32;
export const SINGLE_TX_MAX_BYTES = CHUNK_SIZE * MAX_CHUNKS;

export const unwrapOk = (v) => {
  if (v && v.err !== undefined) throw new Error(`Contract returned err ${JSON.stringify(v.err)}`);
  return v && v.ok !== undefined ? v.ok : v;
};
export const unwrapOptional = (v) => {
  const x = unwrapOk(v);
  if (x && typeof x === 'object' && Object.prototype.hasOwnProperty.call(x, 'some')) return x.some;
  return x ?? null;
};
const num = (v) => (v == null ? null : Number(BigInt(String(v))));
const big = (v) => (v == null ? null : BigInt(String(v)));

/** Error codes a v3 helper can return, in words a holder can act on. */
export const V3_ERRORS = {
  200: 'That token does not exist in the source collection.',
  201: 'This token already has a twin.',
  202: 'This token has no twin yet.',
  203: 'The twin is not in the state this swap needs.',
  204: 'Not authorised.',
  206: 'This token is not in the finalised record.',
  208: 'The record is not finalised yet, so nothing can be inscribed.',
  210: 'The original is not where it should be. Do not send tokens directly to the helper.',
  217: 'The original is listed on its marketplace. Unlist it first, then swap.',
  220: 'This token’s art is over 512 KB and was inscribed by the collection owner before launch.'
};
export const explainError = (code) => V3_ERRORS[Number(code)] || `Contract error u${code}`;

export const isLargeTotal = (bytes) => Number(bytes) > SINGLE_TX_MAX_BYTES;

export function createAdapter({ read, cl, core }) {
  const needHelper = (coll) => { if (!coll.helper) throw new Error(`${coll.key} has no helper contract yet`); };

  async function sourceTotal(coll) {
    try { return num(unwrapOk(await read(coll.source, 'get-last-token-id', []))); }
    catch { return null; }
  }

  /** What the registry says must be true of the on-chain helper. Empty list = matches. */
  function checkAgainstRegistry(coll, st) {
    const out = [];
    if (!st || st.interface !== 'v3') return out;
    if (st.collectionKey && st.collectionKey !== coll.key) out.push(`collection key is "${st.collectionKey}", registry says "${coll.key}"`);
    if (st.source && st.source !== coll.source) out.push('source contract differs from the registry');
    if (st.master && st.master !== core.contract) out.push('core contract differs from the registry');
    if (st.group && st.group !== coll.group) out.push(`group is ${st.group}, registry says ${coll.group}`);
    if (st.sourceAsset && st.sourceAsset !== coll.sourceAsset) out.push('source asset name differs from the registry');
    if (st.version != null && st.version !== 3) out.push(`interface version is ${st.version}, expected 3`);
    return out;
  }

  async function helperState(coll) {
    if (!coll.helper) return null;
    if (coll.interface === 'v3') {
      const t = unwrapOk(await read(coll.helper, 'get-twin-interface', []));
      const st = {
        interface: 'v3',
        version: num(t['interface-version']),
        collectionKey: t['collection-key'] ?? null,
        master: t.master ?? null,
        source: t.source ?? null,
        sourceAsset: t['source-asset'] ?? null,
        group: t.group ?? null,
        finalized: t['canonical-finalized'] === true,
        canonicalCount: num(t['canonical-count']),
        manifestHash: t['manifest-hash'] ?? null,
        inscribedCount: num(t['inscribed-count']),
        swapsEnabled: t['swaps-enabled'] === true,
        largeUnbound: num(t['large-unbound']),
        fee: big(t.fee),
        maxFee: big(t['max-fee']),
        payees: [t['payee-a'], t['payee-b']].filter(Boolean),
        owner: t.owner ?? null
      };
      st.mismatches = checkAgainstRegistry(coll, st);
      return st;
    }
    const settle = async (fn) => { try { return unwrapOk(await read(coll.helper, fn, [])); } catch { return null; } };
    const [count, fin, fee, free, pay] = await Promise.all([
      settle('get-inscribed-count'), settle('is-finalized'), settle('get-fee'), settle('get-free-threshold'), settle('get-payouts')
    ]);
    return {
      interface: 'v1', version: 1, group: coll.group,
      finalized: fin === true, inscribedCount: num(count), canonicalCount: null,
      swapsEnabled: true, largeUnbound: 0, fee: big(fee), freeThreshold: num(free),
      payees: pay ? [pay.a, pay.b].filter(Boolean) : [], mismatches: []
    };
  }

  /** One token, normalised across v1 and v3. Source-only when there is no helper yet. */
  async function tokenView(coll, tokenId) {
    const idArg = cl.uint(tokenId);
    const safe = async (p) => { try { return await p; } catch (e) { return { __error: e.message }; } };
    const ownerRaw = await safe(read(coll.source, 'get-owner', [idArg]));
    const sourceOwner = ownerRaw && ownerRaw.__error ? null : unwrapOptional(ownerRaw);
    const view = { tokenId: String(tokenId), sourceOwner, sourceOwnerError: ownerRaw && ownerRaw.__error || null,
      binding: null, canonical: null, twinOwner: null, custody: null, listed: null, side: null, liquidOwner: sourceOwner };
    if (!coll.helper) return view;

    const canonFn = coll.interface === 'v3' ? 'get-canonical' : 'get-canonical-hash';
    const [bindRaw, canonRaw, listedRaw] = await Promise.all([
      safe(read(coll.helper, 'get-binding', [idArg])),
      safe(read(coll.helper, canonFn, [idArg])),
      coll.interface === 'v3' && coll.group === 'G2' ? safe(read(coll.helper, 'is-source-listed', [idArg])) : Promise.resolve(null)
    ]);
    const b = bindRaw && bindRaw.__error ? null : unwrapOptional(bindRaw);
    const c = canonRaw && canonRaw.__error ? null : unwrapOptional(canonRaw);
    if (c) {
      view.canonical = coll.interface === 'v3'
        ? { hash: c['content-hash'], mime: c.mime, totalSize: num(c['total-size']), tokenUri: c['token-uri'] }
        : { hash: typeof c === 'string' ? c : c.hash ?? null };
    }
    if (listedRaw && !listedRaw.__error) view.listed = unwrapOk(listedRaw) === true;
    if (b) {
      const xid = String(b['xtrata-id']);
      const escrowed = b['xtrata-escrowed'] === true;
      view.binding = { xtrataId: xid, escrowed, inscriber: b.inscriber ?? null, at: num(b.at) };
      const xo = await safe(read(core.contract, 'get-owner', [cl.uint(xid)]));
      view.twinOwner = xo && xo.__error ? null : unwrapOptional(xo);
      // The stored flag is only a claim. Judge custody from real ownership, as the helper does.
      const me = coll.helper;
      const consistent = escrowed
        ? view.twinOwner === me && view.sourceOwner !== me && view.sourceOwner != null
        : view.sourceOwner === me && view.twinOwner !== me && view.twinOwner != null;
      // A failed owner read says nothing about custody: report it as unreadable, never as a mismatch.
      const unreadable = !!view.sourceOwnerError || !!(xo && xo.__error);
      view.custody = { consistent: unreadable ? false : consistent, stranded: !unreadable && view.sourceOwner === me && view.twinOwner === me, unreadable };
      view.side = escrowed ? 'original-liquid' : 'twin-liquid';
      view.liquidOwner = escrowed ? view.sourceOwner : view.twinOwner;
    }
    return view;
  }

  async function quoteInscribeFee(coll, wallet, totalSize, chunkCount) {
    needHelper(coll);
    const app = big(unwrapOk(await read(coll.helper, 'fee-for', [cl.principal(wallet)])));
    let master = 0n;
    if (totalSize) {
      const q = unwrapOk(await read(core.contract, 'quote-single-tx-fee', [cl.uint(totalSize), cl.uint(chunkCount)]));
      master = big(q && q['total-fee'] != null ? q['total-fee'] : q) ?? 0n;
    }
    return { app: app ?? 0n, master, total: (app ?? 0n) + master };
  }

  const SWAP_FN = {
    v1: { 'original-to-twin': 'swap-nft-for-xtrata', 'twin-to-original': 'swap-xtrata-for-nft' },
    v3: { 'original-to-twin': 'swap-original-for-twin', 'twin-to-original': 'swap-twin-for-original' }
  };

  /** The swap that is valid right now for a token view, or null. */
  function validSwap(view) {
    if (!view.binding) return null;
    return view.binding.escrowed ? 'original-to-twin' : 'twin-to-original';
  }

  /** Call description for a swap. */
  function buildSwap(coll, tokenId, direction) {
    needHelper(coll);
    const fn = SWAP_FN[coll.interface][direction];
    if (!fn) throw new Error(`Unknown swap direction "${direction}"`);
    return { contract: coll.helper, fn, args: [cl.uint(tokenId)] };
  }

  /** v3 only: a sponsor supplies the token id and the chunks; the record fixes everything else. */
  function buildInscribe(coll, tokenId, chunks) {
    needHelper(coll);
    if (coll.interface !== 'v3') throw new Error('Inscribing from the shared page needs a v3 helper; use the original page for this collection.');
    if (!chunks.length || chunks.length > MAX_CHUNKS) throw new Error(`Chunk count must be 1 to ${MAX_CHUNKS}`);
    return { contract: coll.helper, fn: 'inscribe', args: [cl.uint(tokenId), cl.list(chunks.map((c) => cl.buffer(c)))] };
  }

  /** Why a write is not allowed right now; null means it may proceed. */
  function writeBlock(coll, st, view) {
    if (!coll.helper) return 'No helper contract is deployed for this collection yet.';
    if (coll.status !== 'live') return `This collection is "${coll.status}", not live.`;
    if (coll.interface !== 'v3') return 'This collection runs on the original helper. Use its original page to inscribe or swap.';
    if (!st) return 'Helper state could not be read.';
    if (st.mismatches && st.mismatches.length) return `The deployed helper does not match the registry: ${st.mismatches[0]}.`;
    if (!st.finalized) return 'The record is not finalised yet, so nothing can be inscribed or swapped.';
    return null;
  }

  return { sourceTotal, helperState, tokenView, quoteInscribeFee, validSwap, buildSwap, buildInscribe, writeBlock, checkAgainstRegistry };
}

// ---- hashing / chunking (same rule as the Xtrata core and the manifest builder) ----
export function chunkBytes(bytes) {
  const out = [];
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) out.push(bytes.subarray(i, Math.min(i + CHUNK_SIZE, bytes.length)));
  return out;
}
const hex = (b) => Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
/** Rolling hash: h0 = 32 zero bytes; h = sha256(h || chunk). Returns '0x…'. */
export async function rollingHash(chunks, subtle = globalThis.crypto.subtle) {
  let run = new Uint8Array(32);
  for (const chunk of chunks) {
    const cat = new Uint8Array(run.length + chunk.length);
    cat.set(run, 0); cat.set(chunk, run.length);
    run = new Uint8Array(await subtle.digest('SHA-256', cat));
  }
  return '0x' + hex(run);
}
export const sameHash = (a, b) => String(a || '').toLowerCase().replace(/^0x/, '') === String(b || '').toLowerCase().replace(/^0x/, '') && !!a;
