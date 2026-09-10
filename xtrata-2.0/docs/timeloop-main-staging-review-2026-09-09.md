# Timeloop Detective: selective staging integration

Follow-up: the public-viewer blocker recorded below has now been addressed
on staging by the implementation documented in
[Timeloop public wallet bridge](timeloop-public-wallet-bridge.md). The
original review below records why that additional work was necessary.
Real-wallet and hosted-deployment checks are still separate release steps.

## Scope and provenance

Prepared on 9 September 2026 from `origin/main-staging` at
`5cf8ea434b5e4e9fa90ada811b652070dc6fbcfd`. Cherry-picked only
`552e56fb50e54f2425153e64b5f93ee17e50887c` from the chess branch, using `-x`
to retain provenance. The resulting staging commit is `bd8325d4`.
This companion change adds regression tests and these review notes.

No chess features, Dataing OAuth, database migration, CV documents, image,
audio or video files are included in this integration. The standalone game
remains a separate local inscription artifact in the ignored `AAA-Collection`
directory; it is not published by pushing these host changes.

## Exact production behavior

1. `src/App.tsx` now reads an optional native STX transfer `fee` through the
   existing `parseRuntimeFee` helper. The accepted request range is 1 through
   1,000,000 microSTX. Missing, invalid, zero or larger values are omitted so
   the wallet estimates its fee. This is a cap on the requested fee, not on
   the wallet's eventual fee.
2. The same handler reads the optional `address` as the requested sender.
   It obtains the host wallet session, connects if necessary, and refuses
   to open a transfer when connection was cancelled, a known session network
   differs from the request, or a supplied sender differs from the session.
   It forwards the session address as `stxAddress` to the wallet adapter.
3. Wallet errors now reject the pending bridge request and return to the
   inscription. Success and cancellation continue through their existing
   callbacks. This does not add retrying, automatic signing or broadcasting.
4. `src/lib/wallet/connect.ts` now preserves an explicitly supplied fee in
   the modern Xverse `stx_transferStx` fallback payload. That adapter is
   shared by other native STX transfer callers. Its other provider routes
   already included the optional fee.

The game supplies the 1 STX payment, recipient
`SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X`, memo `TD:WEDNESDAY:1`,
and requested 0.003 STX mining fee. The host hardcodes none of these game
values. A wallet can override or reject the fee. Check the final approval
screen; 1.003 STX is the requested total, not a guaranteed final total.

## Effect on other Xtrata functions

No contract, mint sequence, inscription fee default, marketplace settlement,
NFT transfer, storage format, layout or content reconstruction code changes.
Existing bridge requests that omit fee and sender still work. A disconnected
caller can now encounter a connection step before transfer approval.
An app using a stale account or asking for a different network is refused
and must reconnect or correct its request. This is an intentional change
that can reveal inconsistent integrations. Session checks cannot guarantee
the extension account never changes later; the provider and final wallet
approval remain necessary checks.

The Xverse fallback now sees fee values it previously did not receive. This
is the main shared compatibility surface: provider versions can reject an
optional field or use a different fee. Mock-provider tests do not prove
compatibility with every deployed wallet version. Errors should be shown
without automatic retrying or a second payment.

## Newly identified public-viewer blocker

**This patch alone does not enable Timeloop wallet features on the public
homepage.** The bridge in `App.tsx` is mounted under the gated admin route
in `src/main.tsx`. The public `index.html` / `src/home/main.js` viewer is a
different implementation. Its sandboxed inscription frames do not currently
have a parent handler for `xtrata:wallet:hello` and `xtrata:wallet:request`.

The v1.3.4 game's `src/chain-save.ts` requires that immediate-parent
handshake; it does not connect directly to an extension when opened as a
standalone file. Therefore wallet connection, cafe purchases and save-memo
transactions must not be represented as public-viewer ready on the strength
of this cherry-pick. Portable saves and ordinary gameplay are separate.

Before permanent inscription/public launch, implement and test the public
viewer bridge (or an explicitly supported public wallet-enabled game host).
Keep the sandbox intact; bind requests to actual allowed frames and tokens,
retain origin/account/network checks and explicit wallet approval, and test
with the exact game HTML. This is additional host work, not a reason to
restore the disabled legacy public mint route.

## Validation on the selective staging checkout

- Full `npm run build` passed, including prebuild manifests, auxiliary app
  builds and postbuild static copies. Dependencies were reused from the local
  installation; this was not a fresh `npm ci` or hosted deployment.
- Wallet, runtime fee, runtime opening and new actual-message-handler
  regression suites: **72 tests passed**. The new 15 cases exercise signer
  and network mismatch, no optional fields, invalid fees, connect/cancel,
  provider errors, and the existing origin/token gates. The test harness
  transpiles the actual App handler and parsers rather than duplicating them.
- Existing `npm run smoke:premerge:tests`: **137 tests passed**. This overlaps
  the wallet suite above; these counts are not distinct tests to add together.
- `npm run contracts:verify` passed.
- The earlier branch assessment found 8 existing lint errors in files this
  integration does not change. The repository-wide lint/typecheck gates are
  not being represented as clean. This integration does not repair unrelated
  baseline errors.
- No real wallet approval, payment, database mutation or blockchain broadcast
  was performed. The live public hosting configuration was not inspected.

## Before promotion to main

Keep `main` unchanged until the public-viewer gap is resolved and the
deployed staging route has been tested with the intended wallet. First
connect, review the exact recipient/amount/memo/fee and cancel. A real
payment and receipt-recovery test is a separate user-approved spending step.

`main-staging` already contains other work and has diverged from `main`.
Review its complete promotion diff separately, or promote only the reviewed
Timeloop commits onto current main. Testing this selective staging addition
does not certify every existing staging change for production.

The production-code change can be rolled back with a normal revert of
`bd8325d4`; that restores the previous native STX bridge behavior. It does
not reverse any blockchain transaction or alter the standalone game.
