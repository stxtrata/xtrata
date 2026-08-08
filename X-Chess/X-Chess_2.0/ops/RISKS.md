# Risks

Known technical, economic and runtime risks, with status and mitigation. A risk
leaves this list when it is closed by evidence, not by confidence.

Updated 2026-08-08.

---

## Open, and blocking launch

### R1 — Contract outflows and post conditions
**Severity** critical. **Status** CLOSED 2026-08-08, on mainnet.

**A wallet holding exactly zero STX played chess.** Bootstrapped by the
creator's single transaction, it submitted a move and the contract paid its gas
back in the same transaction, with the contract-principal post condition
accepted by a real wallet through the real path.

```
tx        0x89737c65948299778e...     submit, success, fee 3000 uSTX
event     transfer 10000 uSTX  CONTRACT -> SP1CVH5EWQ...
balance   60000 -> 67000
```

No server, no private key, no sponsor daemon took part. That is the core of
section 78, proven on chain rather than argued.

Kept here rather than moved to Closed, because the same encoding still has to
survive Leather, mobile, and the Xtrata bridge - rows the matrix covers and this
did not.

*Historical record of the failure that got here:*

**2026-08-08.** It fired, on mainnet, on the first real sponsored open. Not in
the way predicted: the encoding was correct and the wallet handled it fine. The
guard simply did not write a condition at all, because `open-sponsored-game`
pays its bootstrap to the OPPONENT and the model only asked what came back to
the caller. Transaction `0x16033c85...` returned `(ok u3)` and was discarded by
`abort_by_post_condition`, costing 0.1 STX. Fixed; see ADR-0008.

**Still open:** a sponsored SUBMIT, where the contract pays a rebate back to
the caller, has still never reached a wallet. That is the original R1 and it is
row 4 of the matrix.

*Mitigation so far.* The encoding matches `@stacks/transactions` byte for byte,
and a real wallet has now accepted a contract-principal condition in a
transaction that reached the chain. What is proved is the encoding and the
wallet path; what is not proved is the rebate case.

`tests/wallet/outflows.test.ts` now asserts what every call declares the
contract pays out, which is the check whose absence caused the abort.

*What closes it.* Row 4 of `harness/wallets/MATRIX.md`, on both wallets, on
desktop and mobile, framed. Then a mainnet canary sponsored move.

### R2 — Nothing has been signed by a real wallet at all
**Severity** critical. **Status** open.

Everything up to `provider.request` is exercised against fakes. No request has
reached a real extension.

*What closes it.* The full wallet matrix, then the mainnet canary.

### R3 — The runtime emulator has only ever run under jsdom
**Severity** medium. **Status** open, narrowed.

The injection sequence, `document.write`, the serve-time rewrite and the bridge
refusal are reproduced against the built artefact and pass. What has not
happened is a real browser driving `harness/runtime/serve.mjs --framed` with a
real extension behind the bridge.

*What closes it.* The wallet matrix, run through the runtime harness.

---

## Open, not blocking

### R5 — The submit fee is a distribution, not a number
**Severity** HIGH. **Status** CONFIRMED on mainnet, 2026-08-08.

Two `submit` calls on the same contract, hours apart, paid **30,000** and
**3,000** uSTX. A factor of ten, for the same call.

Against a rebate of 10,000 that is the difference between a player being
stranded after two moves and a player finishing a game with more STX than they
started with. Both were observed; the sponsored wallet ended on 67,000 from a
60,000 bootstrap.

The constants were chosen against a single figure. There is no single figure.
See ADR-0009 and `ops/measurements/mainnet-fees-2026-08-08.json`.

*What closes it.* Fee samples across days and both wallets, then constants set
from the high end of what is actually seen rather than the middle.

*Mitigation.* Every constant is a data var with a ceiling; the rebate can be
raised tenfold without a new contract, and games already funded keep their own
terms. The UI must show the remaining allowance rather than implying it is
unlimited.

*Residual.* A spike between funding and play still shortens that game. Accepted.

### R6 — Anonymous zero-STX onboarding is impossible
**Severity** medium. **Status** open, and a protocol limit rather than a defect.

An open game cannot bootstrap an unknown player: they would need a transaction to
identify themselves and have no STX to pay for it. There is no serverless fix.

*Mitigation.* Named sponsored challenges cover the real onboarding case. The
limitation is stated in SPONSORSHIP-V1.md and must be stated in the UI.

### R7 — Ratings are recomputed from genesis on every load
**Severity** medium. **Status** open by design.

Verification is O(all ranked games). It is fine at launch and will not stay fine.

*Mitigation.* Local cache accelerates it; checkpoint inscriptions are designed
for and deliberately not built yet. Neither may ever become authoritative.

### R8 — `Math.pow` is not bit-specified across platforms
**Severity** low. **Status** closed by construction, kept here because it looks
open.

Ratings use `pow` for the expected score. But the expected score is rounded to a
whole per-mille first, which makes the value being rounded a multiple of `1/125`
— so it can never be within `1/250` of a `.5` boundary, against roughly `1e-13`
that a last-bit difference could contribute. Eleven orders of magnitude of
margin, walked and asserted in `tests/rankings`.

### R9 — BNS names are not identity
**Severity** low. **Status** mitigated by design.

Anyone can register a name resembling somebody else's. The principal is the
identity everywhere; a name is display metadata only, and everything works when
resolution fails.

### R10 — Renouncing ownership strands the treasury
**Severity** low. **Status** accepted and documented.

A renounced contract can never withdraw its surplus again, so it stays in the
contract forever. Sponsorship settlement still works, because anyone may call it,
so **no game's reserve is ever stranded** — only X Chess's own revenue.

---

## Closed

### C1 — The brief's sponsorship constants would have stranded every player
**Closed** 2026-08-07 by ADR-0004.

At 0.010 STX per call — what legacy X Chess confirmed on mainnet — bootstrap 0.02
with rebate 0.004 reaches **2 submissions** of a 41-submission game. Measured, and
replaced with constants that complete a full game with the bootstrap untouched.

### C2 — Clarity 4 removed `as-contract`
**Closed** 2026-08-07 by ADR-0001.

Verified against mainnet and clarinet. The contract targets Clarity 4 and uses
`as-contract?`, whose mandatory allowances bound every payout at the language
level.

### C3 — Replay reported a dead start position as a live game
**Closed** 2026-08-07.

King and knight against a lone king is insufficient material the moment it is set
up. Replay reported `live` and labelled every submission "illegal". Found by a
test written while correcting a wrong fixture.

### C5 — No artefact existed, so none had been tested
**Closed** 2026-08-08.

`dist/` is built and `tests/artifact` reads it rather than the source. That is
how three artefact-only bugs were found: an escaped closing tag that stopped the
config script ever closing, boot running before `<body>` existed, and a boot
guard in module scope, which does nothing if the bundle itself runs twice.

### C4 — The gameplay/settlement rebate split cannot be built
**Closed** 2026-08-07 by ADR-0005.

It would require the contract to recognise which strings are control events.
Collapsed to one allowance; the concern is answered by the bootstrap.
