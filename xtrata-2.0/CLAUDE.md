# xtrata-2.0 — working notes

## Contract versions: newest only

**The app talks to exactly one version of each contract — the newest one. Older
versions are supported only through migration, never by reading or writing to them
in the normal path.**

There is no "read both versions and merge" mode. If a page enumerates two versions of
the same contract it is a bug, not a compatibility feature.

Why this is a rule and not a preference: on 2026-07-27 the drops page was measured
loading `xtrata-drops-v1-0` and `xtrata-drops-v1-1` side by side. That was 68
read-only calls per page load, of which **34 went to v1-0 and returned no live drops
at all** — half the page's network budget spent on a contract with nothing in it,
adding seconds before the grid could paint. Every retired version left in a registry
costs that again.

Applies to:

- `src/data/drops-registry.json` — one entry per network, the current version.
- The core inscription contract — the app inscribes to the current core only
  (`SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3` at time of writing).
- Market contracts, and any registry that lists a contract by name.

**When a new version ships:** replace the entry, do not append. If holdings on the old
version still need to be reachable, that is a migration path with its own explicit
surface — not a second entry in the live registry.

**What this rule does NOT license:** rewriting historical records of where past
on-chain activity actually happened. `src/lib/drops/collection-lock.ts` pins a
finished giveaway to the v1-0 drops it genuinely used, and `src/sponsor-ops.ts`
tracks the STX float of contracts that may still need to settle. Those name an old
contract because that is where those drops live; changing them would make the record
wrong rather than making the code cleaner. Retire them when the underlying activity
is finished, not as part of a version sweep.

## Deploying the wizard bundle

`xtrata-agent-one/wizard/agent-one.js` is gitignored and built by `prebuild`. Its
cache-buster (`?v=YYYY-MM-DD.N`) appears in **four** places and they must move
together whenever the bundle's behaviour or API surface changes:

- `src/agent-one/agent-core.ts` (`AGENT_BUILD`)
- `xtrata-agent-one/wizard/index.html`
- `xtrata-agent-one/wizard/manifests.html`
- `xtrata-agent-one/wizard/suno.html` (both the script tag and `XAO_MIN_AGENT_BUILD`)

Forgetting the bump means the browser keeps an old bundle and the page silently runs
against an API that no longer matches — it presents as "feature unavailable (old agent
bundle)", not as an error.

## Verifying wizard changes

`vite dev` rewrites `agent-one.js` into an ES module (it injects an `import` for a
dynamic-import helper), so a plain `<script>` tag cannot execute it and **the whole
agent silently fails to load under the dev server**. Wizard pages must be verified
against a static serve, which is how Cloudflare Pages serves them:

```bash
python3 -m http.server 8099
```

then open `http://localhost:8099/xtrata-agent-one/wizard/index.html`.

## A recurring bug class worth knowing

A read that FAILED and a read that returned "nothing" are not the same answer, and
collapsing them has caused several shipped bugs: a throttled balance lookup read as
"not funded", a lagging holdings index read as "parent never arrived", and a
`ownerOf` error read as "no such inscription — check your token id".

The convention is `ownerOfChecked`-style: return `{ value, ok }` and let the caller
say "could not check right now" instead of asserting something false. Any new code
that turns an error into a default value should be treated as suspect.
