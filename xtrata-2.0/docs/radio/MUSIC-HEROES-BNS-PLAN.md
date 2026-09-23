# Music Heroes and optional BNS linking

## Implemented page

`/music/heroes` is a read-only public page, linked from the Lounge. It ranks
payer addresses by confirmed contract receipts using the existing Lounge reader,
full-history scan and local cache. Shared snapshots keep totals and rankings on
one record set. Duplicate transactions count once (one receipt per transaction in
the current contract); ties share rank. Amounts use integer microSTX arithmetic.

Includes lifetime tiers (1 / 100 / 1,000 / 10,000 / 100,000 / 1,000,000), search,
expandable profiles, top songs/artists, unique songs/recipients, copy address,
explorer links, and recent payments. All fetched strings render as text.

Current limitations: ranks are provisional during scans. This reuses the existing
client history loader rather than adding a new server index. Per-play timestamps
are retained when the upstream event includes block_time/burn_block_time; first,
last, active days and elapsed support time appear only with complete timestamp
coverage. Missing timestamps are not inferred from receipt IDs or scan time.
There is no per-wallet likes enumeration or attribution from a BNS name yet.
Cached history is an availability aid, not a cryptographic proof or independently
audited chain index. Network fees are excluded, never inferred from a fee cap.

Before expanding to date-range charts, add a shared server index of canonical,
successful transactions, timestamps, actual fees and receipt identities. Backfill
at bounded rates through the existing proxy, handle reorgs, and expose a paginated
payer aggregate endpoint. This avoids thousands of per-transaction calls in each
visitor's browser. Show index freshness and completeness explicitly.

## BNS link: basic implementation plan (not activated)

1. Add optional **Name your Music Heroes profile** in both desktop builds. The
   wallet signs a purpose-specific challenge locally after user approval. No key
   leaves the wallet, and this signature cannot approve spending. Keep free
   listening and Music Support consent independent.
2. An HTTPS page accepts the one-time request and asks for a BNS name. Prefer a
   signed message from its current owner. Bind both signatures to the same
   server-generated high-entropy nonce, support address, name, network, purpose,
   Xtrata domain, issuance and expiry. Verify signatures and derive addresses on
   the server; never trust renderer-provided ownership assertions.
3. Optional transfer fallback: require the local wallet's signature first, then
   verify a new confirmed direct transfer of an exact 1,000–9,999 microSTX amount
   from the BNS owner to that support wallet. Amounts are correlation codes, not
   authentication secrets. Bind sender/recipient to the request, enforce one
   active challenge per pair, reject reused transactions, and add a unique memo
   where supported. Allow 15 minutes to submit and a separately bounded pending
   confirmation period. Never ask an exchange to send the verification payment.
4. Verify current BNS ownership, not just resolved payment addresses. Establish
   the authoritative deployed BNS contract/API and name-status semantics during
   implementation. Fail closed on unavailable or ambiguous ownership. Handle
   contract/multisig owners separately rather than assuming standard signatures.
5. Store only public evidence and association state in the website database:
   support address, name, owner, verification time, proof, revocation status.
   Make nonce consumption/link creation atomic and rate-limited. No secrets or
   payments are held by Xtrata. Keep names as labels on address-based rankings;
   never combine multiple addresses silently.
6. Display **BNS link verified by Xtrata**, expose evidence, provide unlinking by
   support-wallet signature, and periodically recheck ownership. A transferred
   name loses its old active association; it never inherits another wallet's
   history. Explain the public privacy link before approval.

## Additional beta builds and release gates

- Choose fresh platform-specific versions at implementation time, after checking
  current release inventory. Do not reuse an existing release tag or overwrite
  an installer. Keep current normal and beta downloads intact.
- Add new Mac standard, Mac legacy and Windows entries as additional options
  under the existing collapsed **Beta Versions** disclosure. Label the feature
  “Optional BNS profile linking”, OS requirements, exact version/build, checksum
  and actual signing/testing status. Do not advertise unbuilt downloads.
- Unit/integration gates: expiry, replay, wrong domain/network/address/name,
  ownership changes, failed API, duplicate/late transfers, simultaneous claims,
  unlinking, stored HTML injection and no spending permission from linking.
- Desktop gates: local signing uses existing protected storage; navigation and
  protocol validation remain strict; restart keeps support OFF; linking cannot
  change payment recipient, queue, fee or wallet identity. Use disposable test
  profiles and offline transport. Supervised transfers require separate approval.
- Build on existing Mac/Windows release pipelines, inspect packages for secrets,
  smoke-test installers and wallet preservation, then publish the additional beta
  links only after artifacts and SHA-256s are verified. BNS linking is optional:
  older apps and all existing anonymous profiles continue working.

## Verification for this page change

Targeted tests cover aggregation/deduplication, shared ranks, tier boundaries,
exact amounts, missing timestamps, filtering, expanded-profile preservation and
untrusted metadata; shared reader and existing beta-card tests also run.
A mocked browser smoke checks the real HTML/module wiring at desktop/mobile
widths without wallets or live transaction transport. No app installers or live
payment tests are part of this page-only change. No release metadata changed.

Checks completed: 11 targeted tests passed (Heroes, shared chain reader, existing
beta downloads). Installed-Chrome Playwright smoke passed with 103 mocked
receipts over six pages, two wallets, desktop and 390px mobile layouts, search,
Bronze tier and no horizontal overflow/JavaScript errors. Screenshots remain local
in `.artifacts/music-heroes/`. Static music-page copy passed. No network payments
or funded wallets were used. This change is prepared for the normal site deploy;
no production deployment or desktop release was performed.
