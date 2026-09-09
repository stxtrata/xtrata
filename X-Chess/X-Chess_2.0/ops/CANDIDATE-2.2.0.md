# X Chess 2.2.0 inscription candidate

Built for the existing mainnet canary contract. **Not inscribed.** This implements
all 15 recommendations in the [3034 review](INSCRIPTION-3034-REVIEW.md). It creates
no new contract, server dependency, signing service or runtime asset dependency.

## Final result

**1,686 standard tests passed** (17 default skips), **76 deep engine tests passed**,
**62 contract tests passed**, and **36 real-browser checks passed** against the final HTML.
Types, serverlessness, documentation and contract analysis passed. The existing
contract analysis warnings and optional test skips are recorded in the evidence.

The final artifact is **254,748 bytes, 16 chunks**, code hash **`f9b2817e`**.
This is 9,444 bytes more than 3034, while retaining 269,540 bytes of headroom within
one 32-chunk upload batch. The additional validation and UI features account for
that increase; the measured optimization is fewer storage transactions and reads.

**Full live verification completed:** 130 ranked entries were checked, 124 games
qualified, and player game counts summed to 248. Mason remained at 28 games and
1374 rating; the old bug would count the checkpoint prefix again. The checkpoint
claimed 123 games, so the authoritative full walk also found one additional
qualifying game. Live game 47 loaded and replayed f2–f4 correctly with all 64
squares guarded against moves during replay. Earlier attempts hit shared API
limits; the successful final run benefited from warmed immutable caches. Cold
walks can still need a retry when the shared endpoints are throttled.

[Inscription HTML](../releases/2.2.0/xchess.html) ·
[Release ZIP](../releases/xchess-2.2.0-candidate.zip) ·
[Machine-readable verification](../releases/2.2.0/verification.json)

The release files and final verification results are collected in
`../releases/2.2.0/`. `manifest.json` records the exact HTML hash, Xtrata rolling
chunk hash, size, chunk count, contract and build stamp. `verification.json`
records executed checks and their limits. Do not substitute a later rebuild
without rerunning artifact and browser tests on those bytes.

| Priority | Implemented update | Validation and inscription effect |
| --- | --- | --- |
| 1 | Full rating verification uses only the chain walk; IDs are counted once and replayed evidence wins overlaps. Derived rating cache schema 2 rejects the old potentially inflated cache. | Seeded-to-full integration regression, duplicate-ID and discarded-seed cases, persistent-cache migration. `elo-v1` unchanged. |
| 2 | Wallet cancellation immediately terminates connection probing and method fallbacks. | Direct and bridged 4001 regressions; captured production shim exercised in a real browser. Unsupported-method/time-budget coverage retained. |
| 3 | Captured production runtime bytes and hashes are checked into the harness; direct/framed browser regressions exercise the built artifact. | The browser report binds results to the exact HTML SHA-256. Local sibling runtime drift can no longer silently change the default test input. |
| 4 | Malformed entries, wrong sequences, invalid ranked IDs and unavailable storage trigger chain recovery. Derived caches validate their shapes. | Corrupt JSON, scalars, invalid rows/IDs, throwing storage and complete cache destruction tests. Valid immutable mainnet cache keys remain readable. |
| 5 | Chain fetch and body consumption share a deadline; explicit aborts remain cancellations. | Hung headers, hung body, fallback, cancellation and timer cleanup tests. Wallet requests have their own existing timing policy. |
| 6 | Move fees are described as an August 2026 observation, with separate contract-fee and current wallet-estimate wording. Unknown pending fees no longer use the historical figure as a replacement threshold. | Browser text checks and existing pending-transaction coverage. No fee service or fee parameter added. |
| 7 | Game loads commit atomically, complete their status notices, and ignore older responses. Newer operation notices survive stale failures; missing-game notices offer a next step. Failed rating walks remove progress and retain the previous table. | Overlapping game loads, stale failures, loading-button recovery and empty-game tests. |
| 8 | Tournament facts and remembered tournament state are keyed by network, contract and schema. | Cross-network/contract/schema isolation tests. Old unscoped values are ignored; cold rebuilds use paced shared reads. |
| 9 | One board tab stop supports arrows, Home/End and guarded activation; square focus survives redraws and flips. Promotion receives focus, cycles Tab, restores board focus and retains Escape. | Keyboard/flip/read-only tests, promotion focus and Space-key regressions, existing replay and pending-move tests. |
| 10 | IndexedDB operations are batched; opening is shared, blocked opens are bounded, and writes await transaction completion. | Native browser benchmark and complete value round-trip: 100 writes and 100 reads each use one transaction. Cache-prefix test uses two bulk reads for 100 entries and zero chain requests. |
| 11 | Explicit candidate configuration, double-build byte comparison, protocol-source pins, full verification script and repository CI workflow. | `build:candidate` executes two matching builds. CI runs source, deep engine, contract, artifact and browser gates and archives evidence; no signing/publishing step. Hosted CI itself has not been dispatched in this session. |
| 12 | README, status, release history, launch scope and risk notes distinguish live 3034, the new candidate and historical wallet evidence. Test counts and artifact metadata come from generated reports. | Documentation audit passes; thousands-separated counts no longer partially match the audit regex. Manual wallet gates remain open. |
| 13 | Challenge a friend, First two players and Community game presets edit the draft through the existing canonical rules and pre-wallet summary. Advanced custom controls remain available. | Each preset maps to existing rules; unnamed friend blocks opening. No existing game is rewritten. |
| 14 | Shared read queue deduplicates in-flight requests, gives active-game reads priority, ages background work, spaces requests and honours Retry-After cooldowns. | Concurrency, priority, spacing, duplicate-body and Retry-After tests. The read transport refuses transaction-broadcast POSTs. Live cold-walk testing prompted burst spacing and stopping failed batches before more work is scheduled. |
| 15 | Fee presentation, rating-cache/merge policy, preset mapping and board keyboard handling are extracted into cohesive modules; transport scheduling is separate from endpoint selection. | Full regression suite plus unchanged protocol hashes. Everything still compiles into the same single HTML artifact. |

## Rebuild and test

```sh
npm ci
npm run build:candidate
npm run verify:candidate
```

The candidate configuration pins version, UTC build stamp, mainnet and
`SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary`.
A full CI verification needs Clarinet 3.12.0 and Chrome; the workflow installs the
reviewed Clarinet release with its published SHA-256 checksum. The local browser
suite can also be run by opening `http://127.0.0.1:4342` after
`npm run serve:browser-tests`.

## Limits and on-chain compatibility

The engine, canonical rules, replay, Elo formula and contract sources are unchanged. The pinned replay, rules, rating and contract
hashes match 3034; the full deep engine and Clarity economics suites are separate
evidence. The frozen rules, event strings, transaction encoding and contract
format remain supported. Only disposable local caches change format.

Use the **new inscription's own ID** in links after inscription. The candidate
retains dynamic URL-based link generation; direct inscription tests boot both
3034 and an arbitrary future ID. Runtime captures, tests, CI scripts and reports
are development artifacts and are not embedded as external dependencies.

Browser tests use a fake wallet, including the production bridge path. They do
not prove new real extension/mobile signing or a real on-chain inscription. Those
checks require the actual provider and final inscription and remain explicitly
separate from this build. No transaction was signed or broadcast in this work.

Clarinet analysis passes with the existing warnings on the unchanged contract.
The SDK test environment also reports its existing Vitest deprecation warning.
