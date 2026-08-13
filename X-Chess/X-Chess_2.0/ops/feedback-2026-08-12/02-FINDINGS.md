# The three confirmed defects

The first two were found by testers in ordinary play on mainnet, are in
inscription 2988 now, and were not visible to 662 tests, a 590-million-node
perft run, or eight reviewers reading the source.

The third was found on 2026-08-13 by clicking Connect on the staging board, and
it is not in the board at all — it is in the Xtrata runtime that serves it.

Each is reproduced below rather than asserted. Run them.

---

## D-1 — Every square on the board is the wrong colour

**Reported as:** "Queens are positioned on wrong squares at start of match -
should be on own colors"
**Actually:** the pieces are correct; the board underneath them is inverted.
**Severity:** high — it is the first thing a chess player checks, and it is
permanent.
**Fix:** one expression. **Proposal 24.**

### The line

`packages/ui/board.ts:169`

```ts
const dark = (file + rank) % 2 === 0;
```

`FILES` is `'abcdefgh'` (`board.ts:90`), so `file` is 0-indexed and `rank` is the
literal digit, 1 to 8. For a1 that is `(0 + 1) % 2 === 0` → `false` → a1 renders
**light**.

In chess, **a1 is dark**.

### Reproduce it

```bash
node -e "
const FILES='abcdefgh';
const shipped = sq => ((FILES.indexOf(sq[0]) + Number(sq[1])) % 2 === 0) ? 'dark' : 'light';
const truth = {a1:'dark',h1:'light',d1:'light',e1:'dark',a8:'light',h8:'dark',d8:'dark',e8:'light'};
for (const [sq,want] of Object.entries(truth))
  console.log((shipped(sq)===want?'  ok  ':'  WRONG')+'  '+sq+'  shipped='+shipped(sq)+'  should be '+want);
"
```

Output today — all eight wrong, which is the point: it is not a special case, it
is a parity inversion.

```
  WRONG  a1  shipped=light  should be dark
  WRONG  h1  shipped=dark   should be light
  WRONG  d1  shipped=dark   should be light
  WRONG  e1  shipped=light  should be dark
  WRONG  a8  shipped=dark   should be light
  WRONG  h8  shipped=light  should be dark
  WRONG  d8  shipped=light  should be dark
  WRONG  e8  shipped=dark   should be light
```

### Why it presented as the queens

The white queen starts on **d1**, which is a light square, and "queen on her own
colour" is how every player checks a board is set up correctly. This board draws
d1 dark, so the white queen appears to be on the wrong colour, and the black
queen on d8 likewise.

The same inversion also breaks "light square on your right" — h1 renders dark —
which players feel as wrongness without necessarily being able to name it.

### What is *not* wrong

The pieces. `packages/chess/` is verified by perft against six canonical
positions to depth 6, roughly 590 million nodes. The starting position is
correct, every move is correct, and no game's result is affected. **This is a
rendering defect and nothing more** — but it is a rendering defect in a permanent
artefact, seen by everybody, on the first screen.

### The fix

```ts
// a1 is dark. FILES is 0-indexed and rank is the literal digit, so the parity
// that makes a1 dark is (0 + 1) % 2 === 1.
const dark = (file + rank) % 2 === 1;
```

### The guard so it cannot come back

The reason this survived is that nothing anywhere asserts a square's colour. Add
that assertion against the four corners plus both queens' home squares, in
`tests/ui/`. Six assertions, and they encode chess rather than the code's own
arithmetic — which is what makes them worth having.

---

## D-2 — Endpoint failover is a one-way ratchet

**Reported as:** switching from game 8 to game 1 with the Open button gave
*"Could not reach any Stacks endpoint, so loading game 1 is unavailable. The
chain is fine; this page cannot see it."*
**Actually:** the board had fallen back down its host list and could no longer
climb back up. Healthy hosts were never tried.
**Severity:** high — it silently removes the redundancy the design depends on.
**Fix:** small, and entirely testable offline. **Proposal 25.**

### The line

`packages/chain/endpoint.ts:214`

```ts
for (let attempt = index; attempt < bases.length; attempt++) {
```

Two consequences, neither intended:

1. **It starts at `index`.** Bases *before* the remembered one are never tried,
   ever — not even when everything after them has failed.
2. **`index` only moves forward.** It is assigned on a successful fallback and
   never reset, so a host that recovers is never returned to.

So the board walks one way down its list of three and stays wherever it lands. By
the time it is pinned to the last host, that host is a single point of failure —
which is the exact opposite of what the list is for. The file's own comment says
the list exists because "naming a single commercial host would make that host a
permanent dependency of a permanent artefact" (`endpoint.ts:28`).

### Reproduce it

Run from the repository root (`X-Chess_2.0/`). The script has to live inside the
tree for the relative import to resolve.

```bash
cat > repro-endpoint.mjs <<'EOF'
import { makeEndpoint, endpointsFor } from './packages/chain/endpoint.ts';
const bases = endpointsFor({ network: 'mainnet' });
const down = new Set([bases[0]]);
const tried = [];
const fakeFetch = async (url) => {
  tried.push(url);
  for (const b of down) if (url.startsWith(b)) throw new Error('ECONNRESET');
  return new Response('{}', { status: 200 });
};
const ep = makeEndpoint({ network: 'mainnet', fetch: fakeFetch });
const name = b => b.replace('https://','').split('/')[0];

await ep.request('/x');
console.log('1. primary has a bad spell  -> pinned to', name(ep.base));
down.delete(bases[0]);
await ep.request('/x');
console.log('2. primary recovers         -> still on', name(ep.base), '  <- never retried');
down.add(bases[1]); await ep.request('/x');
down.add(bases[2]); tried.length = 0;
try { await ep.request('/x'); }
catch (e) { console.log('3. last host wobbles        -> THROWS', e.code); }
console.log('   tried on that call:', tried.map(name).join(', ') || '(none)');
console.log('   healthy, never tried:', bases.filter(b => !down.has(b)).map(name).join(', '));
EOF
npx esbuild repro-endpoint.mjs --bundle --format=esm --platform=node \
  --outfile=/tmp/repro.mjs --log-level=error && node /tmp/repro.mjs
rm -f repro-endpoint.mjs
```

Output today:

```
1. primary has a bad spell  -> pinned to stacks-node-api.stacks.co
2. primary recovers         -> still on stacks-node-api.stacks.co   <- never retried
3. last host wobbles        -> THROWS CHAIN_UNAVAILABLE
   tried on that call: api.hiro.so
   healthy, never tried: api.mainnet.hiro.so
```

Step 3 is the tester's message, produced with a healthy host in the list that was
never asked.

### Why it showed up when switching games and not before

Nothing about switching games is special. What is special is **elapsed time**:
the board polls every 2.5 to 15 seconds, so a long session on game 8 gives the
ratchet many chances to advance. By the time the tester clicked Open on game 1,
the board had walked to the end of its list. The next request had exactly one
host to try, and that host had a bad moment.

Two items in the master list make this materially worse and should be read
alongside it:

- **Proposal 16** — under the Xtrata runtime, the serve-time rewrite removes the
  primary public host from the served bytes, so the list is effectively shorter
  than three before the ratchet even starts.
- **Proposal 7** — the cold load spends about 18 requests where 3 would do, and
  caches rate-limit refusals as answers, both of which raise the odds of the
  failures that drive the ratchet forward.

### The fix

Try **every** base on each call, starting from the remembered one and wrapping
around, so `index` is a preference rather than a floor:

```ts
for (let n = 0; n < bases.length; n++) {
  const attempt = (index + n) % bases.length;
  // ...
}
```

Then let the preference decay: after a period, or on the first failure of the
pinned base, reset `index` to 0 so a recovered primary is actually returned to.

### The guard so it cannot come back

`tests/chain/endpoint.test.ts` already scripts fetches, so this needs no new
machinery. Three assertions:

- with base 0 down, a request succeeds on base 1;
- when base 0 recovers, a later request goes back to base 0;
- pinned to the last base, a failure still tries the earlier bases before
  throwing — the assertion that fails today.

### One thing to fix while in there

`limited` is only set on a literal HTTP 429 (`endpoint.ts:228`). A host that
rate-limits by dropping the connection or answering 503 produces
`CHAIN_UNAVAILABLE` — "the chain is unreachable" — when the truth is "you asked
too often". The tester may have seen this rather than a genuine outage, and the
two need different advice: one says wait a minute, the other says something is
wrong. Worth distinguishing where the evidence allows.

---

## D-3 — Connect freezes the tab, and the runtime is what freezes it

**Reported as:** "Loads ok but clicking connect wallet only starts audio context
the wallet does not connect."
**Actually:** the click starts an infinite loop inside the Xtrata runtime's
wallet shim, made entirely of promise continuations. It does not merely hang —
it starves the microtask queue, so from that moment **no timer in the tab ever
fires again**. Every wallet timeout, every poll, every animation stops with it.
**Severity:** high, and wider than this board — it is every inscription served
through `/runtime/` without a `walletBridgeToken`.
**Fix:** `xtrata-2.0/public/runtime/wallet-shim.js`. Not a board change.

### The loop

`shimRequest` answers a connect method with no host bridge by calling
`connectViaShim` → `connectViaProviderRequest`, and that function asked
`provider.request(...)`.

By then `provider.request` **is the shim**. So the shim answered "connect" by
asking itself to connect, ten spellings at a time, forever.

It closes at the sixth attempt, `stx_requestAccounts`, which `isConnectMethod`
matches — straight back into `connectViaShim`.

### Reproduce it

The page the tester was on: a runtime launcher URL with no bridge token, over
Xverse's `StacksProvider` stub — the one whose `request` throws
`request function is not implemented`.

```bash
npx vitest run src/lib/wallet/__tests__/runtime-shim-connect.test.ts
```

Against the fixed shim: six tests, under a second. Against the shim as it was on
2026-08-13, **that command does not fail — it hangs**, and takes the vitest
worker with it, because vitest's own timeout is a timer too. It was killed at
3m20s. That is the defect, exactly as a person meets it.

### Why nothing caught it

No test anywhere covered the shim. It is a 29 KB file that decides whether any
inscribed application can reach a wallet, and it was the only substantial piece
of the runtime with no suite at all. There is one now.

### The board's half of it

Once the shim settles, the board's own connect had the opposite fault: a
six-second timeout per method, introduced the same day to stop a different
silence. Six seconds is a probe's patience, not a person's — it abandons a
wallet dialog while it is still being read.

That policy has moved out of `apps/chess/main.ts`, where nothing could test it,
into `packages/wallet/connect.ts`, where `tests/wallet/connect.test.ts` asserts
it against an injected clock: a probe gets six seconds, a dialog gets the budget,
and one silent provider can never eat the time the next one needs.
