# Audionaut artist royalty ledger

Implemented 12 October 2026. Page: `/audionauts/royalties/`.
API: `/api/audionaut-royalties`.

## Plan and resulting behaviour

1. Read the Audionauts 1.0 contract's minted index at a confirmed block. Read each
   inscription's original edition/seed wrapper and mint context. Display only
   verified minted editions, never uploaded files or reservations.
2. Match editions to their primary secret song and artist using the reviewed
   engine #3060 catalogue and the supplied song-assignment credits.
3. For each artist, use the current holder of their lowest song inscription ID in
   this catalogue as the receiving wallet, as requested. Normalize BotCupid's
   capitalization and use the nonempty DeOrganized Media credit for both copies
   of song #2989. LIQUIDEZ uses the supplied Χ₮¡₪¢₮ credit, also present in the
   revised Audionaut wrappers. Artist display credits are not ownership claims.
4. Require wallet message sign-in. Approved receiving holders and Xtrata admins
   can see the complete ledger and filter to their royalties. Server access is
   enforced even when the collection studio's `CREATOR_AUTH_MODE` is off or log.
5. Track exactly 5 STX per minted edition. Automatically discover and link
   explicitly tagged transfers. An admin can assign older unlabelled transfers
   to their covered editions. Verify total, recipient, canonical block, mint
   timing, and historical receiving-song ownership before storing a receipt.
6. Reverify recorded transfers on each refresh. Show Paid, No receipt, or Could
   not verify. The admin's allocation identifies the transfer as a royalty; the
   chain establishes that the specified amount reached the correct holder.

This page records receipts only, as confirmed by the user on 12 October. It never
constructs, signs or broadcasts a payment. Existing payments are not assumed
unpaid: editions without a verified allocation are shown as **No receipt**.

## Automated operation

The separate `xtrata-audionaut-royalties` Worker runs every five minutes, including
when nobody has the page open. It uses the existing first-party Hiro read proxy
and D1 database, with no wallet secrets. `workers/audionaut-royalties/wrangler.toml`
owns its schedule. Apply migration 024 in addition to 023 before enabling it.

- Scan current receiving wallets, previously monitored holders and optionally
  configured paying wallets. An admin saves public payer addresses in the page.
  Payer history is needed to discover payments to holders from before monitoring
  began. No paying address has been assumed from unrelated wallet configuration.
- For automatic allocation, use a standard direct STX transfer memo such as
  `audionaut:84`, or `audionaut:2,5` for a 10 STX batch to a common receiving holder.
  Memos must fit Stacks' 34-byte limit. Unrelated or ambiguous 5 STX transfers
  cannot establish which edition was paid. Unlabelled transfers from configured
  payers enter the admin review list; they need a one-time edition assignment.
- Backfill three 50-transaction pages per address per run at a pinned canonical
  block. Resume durable offsets on later runs and inspect a recent page while an
  older backfill continues. Rewind on a changed canonical block. Incomplete or
  failed discovery is visible on the page. Retry failed tagged candidates.
- Validate each discovered transfer through the same historical ownership and
  exact-amount checks as manual receipts. Store allocations atomically and
  reverify the ledger each run. A database lease prevents overlapping scheduled
  runs, and duplicate transfers or editions cannot create a second payment.
- Refresh the authenticated, visible page once a minute, with no overlapping
  requests. Pause while an admin form is open; stop when signed out or hidden.
  **Download song and payment list** exports the current minted assignments,
  receiving addresses and verified payment links as CSV. Source text is escaped
  against spreadsheet formulas.

This release recognizes direct token-transfer transactions. A contract's generic
STX event or send-many payment does not establish the required edition memo and
allocation under this policy, and must not be silently counted as Paid.

Transaction pagination follows Hiro's official v1 address route's `until_block`
and offset semantics; see [the route source](https://github.com/hirosystems/stacks-blockchain-api/blob/main/src/api/routes/v1/address.ts).
The existing project uses v1 transaction evidence; these endpoints are currently
deprecated in favor of v3 but remain supported. The background schedule uses
[Cloudflare Worker Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/).

## Receiving songs

"First song" means the lowest primary-song inscription ID in the reviewed
Audionaut assignments. It does not search every unrelated inscription on Xtrata.
The rule is visible on the page. Addresses are resolved from chain ownership,
not hardcoded from a wallet list or guessed from creator metadata.

| Artist | Receiving song inscription |
| --- | ---: |
| melophonic | 8 |
| Hundred Little Reasons | 312 |
| Cicada | 577 |
| 3ai3 | 1091 |
| Audionals | 1097 |
| BotCupid | 2753 |
| Xtrata Demo | 2830 |
| Lio Rush | 2969 |
| Χ₮¡₪¢₮ | 2983 |
| DeOrganized Media | 2989 |

The chain reader uses six confirmations by default and reuses a chain-only
snapshot for at most one minute. Every authenticated response is private and
uncached. A failed holder read does not become a receiving address. A receiving
song held by a contract/escrow requires ownership resolution before that artist
can sign in or receive a new verified receipt; this first release does not guess
an escrow's beneficial owner.

After a receiving song changes hands, the new direct holder can sign in. Existing
paid receipts remain tied to the holder at the payment block. “My royalties”
includes both current receiving assignments and payments made to the signed-in
address. No extra royalties are added for bonus tracks or playlists.

## Deployment and operation

Before publishing this code:

- Apply `functions/migrations/018_creator_sessions.sql` if not already installed.
- Apply `functions/migrations/023_audionaut_royalties.sql` to the environment's D1
  database. It adds payment records and edition allocations; it does not alter
  existing collections or payments.
- Apply `functions/migrations/024_audionaut_royalty_automation.sql` for resumable
  discovery, candidate review and scheduler status.
- Retain the existing `DB` binding, Hiro API keys and `XTRATA_ADMIN_ADDRESSES`.
  The latter defaults to the existing Xtrata owner address. Receiving holders do
  not need to be added to the creator allowlist.
- Build with the normal pipeline. `build:audionaut` now also builds the ledger's
  wallet/page bundle; `public/` assets are copied by the normal Vite build.

After deployment, visit `/audionauts/royalties/`, sign in with the admin wallet,
open **Record an existing payment**, and enter the transfer transaction ID and
the comma-separated edition numbers it covers. A batch covering N editions must
transfer exactly N × 5 STX to their common historical receiving wallet. The
receipt form does not send any STX. A transfer can be allocated only once and an
edition can have only one receipt, enforced atomically in D1. Invalid/pending
receipts are refused. Receipts are immutable in this first release; a mistaken
allocation needs an audited operator database correction, not a recipient edit.

The user authorized pushing and production deployment on 12 October. Release
preparation uses the current production branch plus these royalty commits only.
No actual wallet sign-in, signing or payment is performed during verification.

To refresh the reviewed catalogue, download the engine as text, then run:

```bash
node scripts/audionaut-royalties-catalogue.mjs engine.js song-assignments.csv
```

The generator parses JSON literals without executing downloaded code. Review the
diff before deploying. It preserves artist credits from the supplied CSV, refuses
conflicting nonempty credits, and records the engine's SHA-256 for provenance.
The catalogue is pinned to the immutable #3060 engine; edition/seed/core/engine
references are checked against minted bytes. Unrecognized wrappers fail closed.

## Verification

- Live public chain read: 18 minted editions, all ten receiving holders resolved.
  Editions: 2, 5, 11, 15, 25, 29, 31, 33, 34, 58, 60, 76, 80, 83, 84, 95, 100, 108.
- Targeted source/payment/access tests: 26 passed, plus 87 existing wallet/session
  regression tests passed (113 total). Checks cover incomplete mint evidence, wrong/failed
  payments, historical holders, missing ownership, strict sign-in, batch
  allocations, duplicate receipts and transactional rollback.
- Browser smoke: signed-out gate, receiving/admin views, filters, unsafe metadata
  displayed as text, failed/successful receipt registration, cleared data after
  denial/sign-out, desktop and 390-pixel mobile layout. Fresh extension-free
  browser, simulated sessions/receipts, disposable generated addresses.
- Ledger bundle, main Vite build and Cloudflare Functions worker compile pass.
- Repository-wide TypeScript checking still reports existing typing failures in
  the wider project. No diagnostics reference the new ledger files.

Repeat the relevant checks with:

```bash
npm run build:audionaut-royalties
npx vitest run functions/lib/__tests__/audionaut-royalties.test.ts functions/lib/__tests__/audionaut-royalty-automation.test.ts functions/api/__tests__/audionaut-royalties.test.ts
node scripts/audionaut-royalties-smoke.mjs
```

Screenshots and downloaded live evidence stay local under ignored scratch/tmp
paths. Only source, tests, schema and documentation belong in the commit.

Automation verification: 37 targeted tests passed. The browser smoke also checks
monitored-address configuration, discovered candidate assignment, inert metadata,
CSV download, one-minute authorized refresh and stopping after sign-out. Worker
dry-run compilation passes. These checks use local simulations/disposable
addresses and never connect an existing wallet or broadcast a transaction.
