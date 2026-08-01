# Wizard Collection — Round 1, what actually happened

The first real run. 35 inscriptions, 24 listings, mainnet, 2026-08-01.

Everything the pipeline planned, it did. Everything it cost, it predicted. What follows is the record, including the four things that went wrong and the two questions that are now answered.

## What is on chain

| | ids | who |
|---|---|---|
| Personas | #2929 Archivist, #2930 Skeptic, #2931 Builder | one each |
| The Machinery | #2932–#2939 | Builder |
| The Cost of Keeping | #2940–#2947 | Archivist |
| What the Hash Omits | #2948–#2955 | Skeptic |
| Manifests | #2956 Machinery, #2957 Keeping, #2958 Omission | one each |
| Marks | #2959 Builder, #2960 Archivist, #2961 Skeptic | one each |
| The arms | #2962 | Archivist holds it |
| The page | #2963 | Archivist holds it |

Contiguous, #2929 through #2963, in the order the graph forced. Blocks 8,685,102 to 8,685,240 — about two and a half hours.

The page: **https://xtrata.xyz/i/2963**

## The graph, verified by reading it back

Every one of these was checked against the chain, not against a receipt:

- 3 personas cite nothing. They are roots and the gate asserts the empty set, because an empty set is still a set.
- 24 plates, each byte-identical to its generated source, each created by its own wizard.
- 3 manifests, each citing exactly its 8 plates **and** its persona.
- 3 marks, each citing exactly its own persona.
- The arms cites exactly the 3 marks.
- The page cites all 31: 24 plates, 3 manifests, 3 marks, the arms.
- 24 plates owned by their makers at listing time.

59 checks per full pass. Nothing was taken on trust from a transaction receipt, including the transactions this process had itself broadcast ten seconds earlier.

## What it cost

Predicted, then measured. They match exactly.

| wizard | started | ended | out |
|---|---|---|---|
| archivist | 5.597 | 4.424 | 1.173 |
| skeptic | 3.858 | 2.767 | 1.091 |
| builder | 4.918 | 3.827 | 1.091 |
| **fleet** | **14.373** | **11.018** | **3.355** |

Of the 3.355, **1.200 is escrowed** listing deposits and returns on a cancel or a sale. Genuinely spent: 2.155.

The 35 mints came to 1.435 STX — 11,000 microSTX protocol plus a 30,000 miner bid, every time, for every body.

## Prices

Each wizard set its own, from its own stated reasoning.

- **The Machinery** — 0.75 STX a plate. Cost plus arithmetic: what a plate cost to mint and escrow, times eight, with the rounding visible.
- **The Cost of Keeping** — 2.50 STX a plate. The Archivist prices custody, not labour.
- **What the Hash Omits** — 0.50 STX a plate. The Skeptic will not charge more for a doubt than for an assertion.

Manifests, marks, the arms and the page are **not listed**. They are the index.

## Two open questions, now answered

**Does `mint-single-tx` charge more for `image/svg+xml` than for markdown?** No. Quoted live before the run for all five body types — persona 1,829 bytes, plate 1,814, mark 1,589, arms 2,192, page 12,866 — and every one is a single chunk at a flat 11,000 microSTX. Mime does not enter into it.

**Do 31 dependencies fit one transaction?** Yes, at the same flat 11,000. The largest the fleet had attempted before this was 8. The fallback plan (cite the three manifests only) was not needed.

**Do the page's recursive references resolve?** Yes. Loaded from the gateway, the arms and all 24 plates render from `/i/<id>`. Nothing on the page comes from a server.

## What went wrong

Four things. None of them cost anything, and three were caught by the machinery rather than by luck.

**1. The plan formatter crashed before the first broadcast.** The CLI passed `inscribe.mjs`'s `formatPlan` as its plan presenter. That formatter is shaped around a corpus entry and reads `plan.subject.id`; a persona plan has no subject. It crashed with nothing signed and an empty journal.

The rehearsal missed it because it supplied no presenter at all. **A port the rehearsal does not supply is a port the rehearsal does not test.** The rehearsal now runs the same port set as the real thing, and `pipeline-core` owns the formatting so a caller cannot pick the wrong one.

**2. The plates gate was rate-limited, and the pipeline halted.** All 24 plates minted correctly. The gate then read them back — 48 calls in a burst — and Hiro's limiter cut in around call 40. Every read after that was a 429, the gate reported `unavailable`, and the run stopped.

**The halt was correct.** An unread inscription is not a verified one. But halting a half-built permanent graph because an API said "slow down" is a bad trade when the answer is to slow down. The read port now attaches the API key, spaces calls 120ms apart, and backs off on 429 with `Retry-After` honoured. Re-run afterwards: 24 verified in 15 seconds, no retries needed.

That the gate distinguished `unavailable` from `failed` is what made this diagnosable in one look. It was worth building.

**3. The manifest count reads oddly.** The output says "listing 8 members" on one line and "listing 9 members" on the next. Both are true and neither is wrong: the manifest names 8 members in its prose and cites 9 ids, because the persona edge was added to the dependency list. It reads like a contradiction. Cosmetic, but worth fixing before someone trusts the wrong line.

**4. The gateway injects a broken tag.** Serving #2963 returns 18 bytes more than were minted:

```
<header><base href="null">
```

Two defects stacked. The href is the literal string `null`, and it was injected into `<header>` rather than `<head>` — the page has no `<head>` at all, and `<head` is a prefix of `<header`. Harmless here because every reference on the page is root-relative, so only the origin is used. It would break any inscription using relative URLs. The on-chain bytes are correct and unmodified; this is entirely a serve-time transformation. Filed separately.

## What the harness caught before the chain did

Building the rehearsal surfaced five more, three in code that was already committed and passing 521 tests. They are recorded in `WIZARD-PIPELINE-PLAN.md` §10. The one worth repeating here:

`flip-byte` in the fake chain used `/.$/`, which without the `m` flag needs a non-newline final character. Every body in this pipeline ends in a newline, so it matched nothing — and **three negative controls passed while corrupting nothing at all.** A control that silently does nothing is worse than not having one.

## What is still true and still unproven

Whether a third-party gallery renders an SVG token-uri. Nothing in this run touched one.

## What the collections still do not do

They share one list of eight subjects, and they do not cite each other on chain. Reading a row across — the same object, three concerns — is an arrangement in a catalogue, not a fact in the graph. That was shipped deliberately; the two ways out are in the plan's §0. The second collection is where they get tried.
