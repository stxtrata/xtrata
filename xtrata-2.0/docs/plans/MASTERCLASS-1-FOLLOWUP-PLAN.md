# Masterclass #1 — follow-up plan (one day of work)

Scope: the action items from the first Xtrata Masterclass that are (a) real bugs
users hit, and (b) small enough to land, test and ship today. Everything else
from the session is parked at the bottom with a reason.

Findings below are grounded in the current code on `main-staging` and in live
mainnet API probes, not in the transcript alone.

---

**Status:** P0-a and P0-b are done. P0-c and the two P1s are still open.

## P0 — BNS claim selection is broken in two separate ways

Reported by Darth Dude: with several BNS names in one wallet, the name chooser
"popped up then disappeared" and the claim failed; and Xtrata uses the first
alphanumeric name rather than the wallet's primary name.

Those are two independent defects. Both live in the Proof of Free claim path.

### P0-a — the chooser is a `window.prompt()` — DONE

`src/home/main.js:11975` `chooseClaimBnsName()`:

```js
let selected = normalizeDropBnsName(result.primary) ?? names[0];
if (names.length > 1 && rules.onePerBnsName) {
  const answer = window.prompt(`Choose the BNS name…`, selected);
  selected = normalizeDropBnsName(answer);
  if (!selected || !names.includes(selected)) throw … 'BNS_SELECTION_INVALID';
}
```

Three problems:

1. `window.prompt()` is fired **after** an `await resolveBnsNames(...)`, so it is
   no longer inside a user gesture. Chrome suppresses repeated/ungestured
   `prompt()` dialogs, and an extension wallet taking focus dismisses it — this
   is exactly "popped up then disappeared".
2. A dismissed prompt returns `null`, which the code turns into a hard
   `BNS_SELECTION_INVALID` throw. A suppressed dialog therefore *fails the
   claim* instead of falling back to the default.
3. The chooser only appears when `rules.onePerBnsName` is set. Under a
   `requireBnsName`-only policy the wallet's name is picked silently, so the
   claimer never sees which of their names was burned.

**Fix:** replace the prompt with an in-page modal, reusing the existing drops
dialog styling (same pattern as `showDropNotice`). Requirements:

- Rendered before any await that could steal focus; the claim `await`s the
  modal's promise.
- Shows all names, radio-style, defaulting to the on-chain primary (P0-b).
- Shown whenever `names.length > 1` and *any* BNS policy applies, not just
  `onePerBnsName`.
- Cancel resolves to "cancelled" → the claim aborts cleanly with a diagnostic,
  no scary error.
- Remembers the choice per wallet in `localStorage`
  (`xtrata.drops.bnsChoice.<address>`) so repeat claimers aren't asked again.
- `recordDropDiagnostic(round, 'BNS_NAME', …)` stays, so the debug panel still
  shows what was used.

Built as specified, with one change: the reset control went into the Claim
diagnostics actions row rather than onto the drops status line. The status line
is rewritten on every step of a claim, so a link there would have survived for
about a second. The dialog's own copy points at where the setting lives.

### P0-b — "primary" is guessed alphabetically, never read from chain — DONE

`src/lib/bns/helpers.ts:52` `pickPrimaryBnsName()` prefers a `preferred` value
if it ends in `.btc`, else takes the **first `.btc` name in sort order**. The
`preferred` value comes from `extractNamesFromApiResponse()`
(`src/lib/bns/resolver.ts:501`), which looks for `primary` / `is_primary` /
`primary_name` fields on the BNSv2 response.

Verified live — the BNSv2 endpoint we call returns none of those fields:

```
GET https://api.bnsv2.com/names/address/SP10W2…9TM7/valid
→ {"total":3,"names":[{"full_name":"audionals.boom",…},{"full_name":"jim.boom",…},{"full_name":"jim.btc",…}]}
```

No primary flag anywhere, and `/…/primary`, `/primary-name/…`,
`/resolve-address/…` all 404. So `preferred` is always `null` and we always fall
back to alphabetical. A wallet whose primary is `zed.btc` but which also holds
`aaa.btc` gets the wrong name — the reported behaviour.

The authoritative source is the BNS-V2 contract. Verified live:

```
SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2 :: get-primary(owner)
→ (ok (some {name: 0x6a696d, namespace: 0x627463}))   ; "jim" + "btc" = jim.btc
```

(`get-primary-name` also exists but returns the internal name *id* as a uint —
use `get-primary`, which returns the name/namespace buffers directly.)

**Fix:**

1. New `src/lib/bns/primary.ts`: `resolvePrimaryBnsName({ address, network })`
   → calls `get-primary` read-only through the existing read-only helper,
   decodes the two buffers as ASCII, returns `name.namespace` or `null`.
   Cache with the same key scheme / TTL as the other BNS lookups
   (`buildBnsCacheKey({ kind: 'primary' })` — add the kind to
   `src/lib/bns/helpers.ts:6`).
2. `resolveBnsNames()` (`resolver.ts:1261`) calls it alongside the names lookup
   and passes the result in as `preferred`. Contract answer wins over every
   heuristic; on failure we degrade to today's behaviour, so this can't make
   things worse.
3. `pickPrimaryBnsName()` gains a third argument `onChainPrimary` that
   short-circuits ahead of the `.btc` preference. Keep the existing heuristics
   as the fallback path.
4. Testnet: the BNS-V2 deployment differs — put the contract id in
   `src/lib/bns/config.ts` per network and skip the call when unset.

**Tests:** extend `src/lib/bns/__tests__/resolver.test.ts` and
`helpers.test.ts` — primary honoured over alphabetical; contract error falls
back; non-`.btc` primary (e.g. `jim.boom`) is respected rather than being
overridden by a `.btc` name.

### P0-c — surface the primary everywhere it's shown

Once `resolveBnsNames()` is authoritative, `AddressLabel`
(`src/components/AddressLabel.tsx`) and `WalletLookupScreen` display the real
primary for free. Add a "primary" badge next to it and list the other held
names beneath, so multi-name wallets can see what the chain says without
opening an explorer.

---

## P1 — Forever Twins: turn "request a slot" into an actual request

`forever-twins/index.html:416` — "Request a slot" is an anchor to `#founders`.
Requests are handled by DM today, which was called out in the session as the
bottleneck.

Today's slice (not the full grant-funded self-service tool):

- A request form on the Forever Twins page: collection name, contract id,
  supply, contact (X / Discord / email), and a note.
- Pre-flight the contract id client-side: read `get-last-token-id` and
  `get-token-uri` on the pasted principal and show whether it looks
  twin-compatible, plus a rough cost at the current per-NFT rate. This answers
  most of the "can you do my collection?" questions without any human.
- A Pages Function next to `forever-twins/functions/api/gallery-cache.js` that
  appends the submission to a store and pings the ops channel.
- Rate-limit by IP + a honeypot field; no wallet connection required.

Out of scope today: pricing negotiation, on-chain queueing, automated minting.

---

## P1 — Synced lyrics in the Opus player

`opus-file-generator/HTML_Template.js:1275,1638` already inscribes a lyrics
panel, but auto-scroll is purely linear: `scrollTop = (currentTime/duration) *
range`. Anything with an intro or an outro drifts immediately.

Today's slice: support LRC timestamps.

- If a lyrics line starts with `[mm:ss.xx]`, parse it into `{ t, text }`.
- Render lines as `<p data-t>`; highlight the active line and scroll it to
  centre. Click a line to seek.
- No timestamps → unchanged linear scroll, so existing inscriptions are
  unaffected.
- The generator UI (`metadata-modal-handler.js`) gets a hint that LRC is
  accepted, and pastes from Suno keep working as plain text.

This is self-contained in the inscribed template — no contract or site change,
and it makes the next music inscription visibly better on stream.

---

## Parked, with reasons

- **Radio auto-updating playlist** — already done. `src/home/radio.js:765`
  pulls `/index/playable`, so newly inscribed songs appear without a deploy.
  The AI host belongs with `docs/plans/RADIO-V2-DESIGN-PLAN.md`, not today.
- **Deterministic chunk wizard** — worth doing, but it's a rework of the
  sequencing logic, not a day's work.
- **Community-priced Forever Twins** — needs a pricing decision first.
- **Royalty splits on parent/child** — contract work; design before code.

---

## Suggested order

1. P0-b (`primary.ts` + resolver wiring + tests) — everything else depends on
   knowing the right default.
2. P0-a (modal) — the visible fix Darth Dude reported.
3. P0-c (badge) — near-free once P0-b lands.
4. P1 lyrics (isolated, low risk).
5. P1 Forever Twins form if the day allows.

Verify P0 against a wallet holding several names where the primary is *not*
first alphabetically — that's the only case that distinguishes fixed from
broken.
