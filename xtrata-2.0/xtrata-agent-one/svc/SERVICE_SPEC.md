# Xtrata Agent One — Inscription Service (deposit-wallet model)

Inscription-as-a-service: a user hands Xtrata Agent One a file; the agent quotes
it, spins up a **one-shot deposit wallet**, the user funds exactly that wallet,
the agent inscribes from it, **delivers the inscription + refunds the change**,
then **destroys the wallet key**. Permissionless, auditable, no account.

Engine reuse: the heavy lifting (staged upload + seal) is the already-tested
`agent-large-inscribe.mjs`; this service wraps it with the per-job wallet
lifecycle, delivery, refund, receipt, and key disposal.

Core is parameterised (`XTRATA_CORE`): `xtrata-v3-2-3` today (≤32 MiB),
`xtrata-v3-2-4` once the handover lands (≤128 MiB, single-token media).

## Lifecycle (state machine — one job, resumable from its state file)

```
QUOTED          file chunked + priced; required deposit computed (cost + buffer + margin)
WALLET_CREATED  fresh BIP-39 wallet generated; deposit address shown to the user
AWAITING_DEPOSIT poll the deposit address until balance >= required
FUNDED          deposit confirmed on-chain
INSCRIBING      run the staged runway from the deposit wallet -> token-id
DELIVERED       transfer the inscription to the user's address
REFUNDED        return remaining balance (change/dust) to the user
RECEIPT         emit an XIP-011 type:receipt (quote, deposit tx, token-id, delivery/refund txs)
COMPLETE        wipe the ephemeral key from the job state; address retired forever
```

Every transition checks chain state first, so a crash resumes from where it
stopped. Nothing in the flow needs the user's keys.

## The deposit wallet

- **Fresh per job.** A new BIP-39 mnemonic is generated for each job; the Stacks
  key is derived at `m/44'/5757'/0'/0/0`. It is used for nothing else, ever.
- **One-shot.** The address is single-use. After completion the key is wiped and
  the address retired — a later deposit to it would be unrecoverable, so the
  user is told plainly: fund it once, for this job only.
- **Custody window.** Between the user's deposit and the refund, the agent
  controls a key holding the user's funds. This is custodial for that window and
  cannot be made trustless on a deployed core. Mitigations below.
- **Disposal.** "Destroy the key" = remove the mnemonic/private key from the job
  state and memory at COMPLETE. The job record keeps only public facts (address,
  txids, token-id) for audit.

## Quoting & the deposit amount

`required = protocolFee + minerEstimate + deliveryFees + serviceMargin + safetyBuffer`

- `protocolFee` from the core's on-chain `quote-inscription-fee` / `quote-single-tx-fee`.
- `minerEstimate`: staged upload batches are size-based; the deposit deliberately
  **over-collects** (a conservative per-batch fee) and the surplus is refunded.
- `deliveryFees`: the inscription-transfer + the refund transfer.
- `serviceMargin`: optional, configurable (the agent's fee), 0 by default.
- The user always gets the unused remainder back, so over-collection is safe UX.

## Execution, delivery, refund

1. **Inscribe** — run `agent-large-inscribe.mjs` with the deposit wallet's
   mnemonic, the file, uri, mime (and optional deps/parent). Mints to the deposit
   wallet; resume-safe; deny-capped; budgeted by the deposit balance.
2. **Deliver** — `transfer(token-id, deposit-wallet, user)` so the user owns the
   inscription.
3. **Refund** — send the remaining STX balance (minus the refund tx fee) back to
   the user. Change and dust go home.
4. **Receipt** — write an XIP-011 `type: receipt` recording quote, deposit tx,
   token-id, delivery + refund txids. (Optionally inscribe it for a permanent,
   public track record — the agent's reputation lives on-chain.)
5. **Wipe** — scrub the key from the job state; mark COMPLETE.

## Parent escrow (parent-linked children)

The contract requires the **minter to own every parent** at mint/seal
(`validate-parents` → `ERR-NOT-AUTHORIZED`), so parent-linked jobs use a brief
escrow: declare `parents` at job creation; send the parent inscription(s) to
the **same deposit address** as the STX payment. The gate holds until the
deposit is funded AND all parents are held (`AWAITING_PARENT`), then the child
is minted via `mint-single-tx-with-relationships` (or the staged engine's
`seal-with-relationships`), and **parent + child + receipt + change are all
returned to the payer**.

Mistake handling (never-strand, NFT edition):
- **Wrong inscription sent** (not a declared parent): nothing is inscribed —
  every held inscription and all STX are returned; strays go back to whoever
  sent them (NFT history), declared items to the payer.
- **Parent never arrives**: after `AGENT_PARENT_WINDOW_MS` (default 15 min from
  funding) the deposit is fully refunded.
- **Parent sent but no/insufficient STX**: on expiry the parent is returned to
  its sender; the key is never wiped while the wallet holds any inscription or
  STX above dust.

## Batch inscriptions (one payment, N inscriptions, one receipt)

`createBatchJob({ items, parents, ... })` / `POST /api/jobs { items: [...] }` — up to
40 items (any mix of types) funded by ONE deposit. Job-level `parents` are escrowed
once and linked to EVERY item (per-item parents merge on top); deps may reference
earlier items as `'@k'`, resolved to real token ids as the batch mints — whole
dependency graphs ship in one payment. Music items take `suno: true` +
`artworkFile` (per-track cover, overrides embedded art).

Semantics: atomic *payment*, not atomic *minting* — the loop is resume-safe and
idempotent per item. A deterministic item failure marks that item FAILED and
continues (`strict: true` skips the rest instead); transient errors retry the batch
at the failing item. Delivery mints ONE batch receipt (per-item table, outcomes,
parents, totals; receipt deps = minted tokens + parents + agent identity), delivers
every minted token + receipt, returns parents, sweeps change → `COMPLETE` or
`COMPLETE_WITH_SKIPS`. Zero mints → full refund of funds AND all escrowed parents,
with the batch summary on the refund receipt. All never-strand/key-wipe invariants
apply unchanged.

## Trust model (honest)

- **Provable:** the deposit wallet's signer/creator, every txid, the delivered
  token, the refund — all on-chain.
- **Trusted for the custody window:** that the agent inscribes and returns rather
  than absconds. Mitigated by: exact-amount deposit, short-lived one-shot key,
  deliver-then-refund-then-wipe, and **on-chain receipts** building an auditable
  reputation.
- **Non-custodial endgame:** Stacks **sponsored transactions** or the AIBTC
  **x402 relay** — the user signs and the relay/agent pays fees — remove the
  deposit-custody step entirely. The deposit-wallet model is the pragmatic v1;
  sponsored is the target v2.

## Safety invariants

1. Never request, hold, or derive the *user's* keys. Only the per-job key.
2. Deposit amount is exact + refundable; never keep more than the quoted cost
   (+ explicit margin).
3. Inscription is delivered to the user; nothing of value is retained by the agent.
4. Every spend uses deny-mode post-conditions and a per-job budget (the deposit).
5. The ephemeral key is wiped at COMPLETE; its address is never reused.
6. Dry-run first; one human/operator confirmation before the first real spend of a job.

## Hardening status (agentic → deterministic)

This service follows `../PROGRESSIVE_HARDENING.md`: agentic-first, then replace as
much as possible with deterministic hardened code. It is already **deterministic on
every money/sign/irreversible step** — the only agentic surface is intake.

```
[D] quote (chunk + on-chain quote)             deterministic
[D] generate one-shot deposit wallet (BIP-39)  deterministic
[A] intake: file, uri, mime, recipient, intent agentic now → railroad to choices
[D] watch deposit (poll balance)               deterministic
[D] inscribe (runway), deliver, refund, wipe   deterministic
```

`[A]` agentic · `[H]` hybrid · `[D]` deterministic.

**Railroad intake into multiple-choice** so even the one agentic step funnels into
deterministic branches. Ask, don't free-type:

- *What are you inscribing?* image / video / audio / document / data → sets mime + defaults.
- *One token, or a collection?* single / collection → picks the runway path.
- *Link it to anything?* none / parent (you own it) / dependency → drives relationships.
- *Where should it be delivered?* connected address / paste address (validated immediately).
- *Confirm the quote?* shows exact deposit → yes proceeds, no cancels.

Each answer maps to an enumerated value the deterministic core fully handles, so there
are no un-handled branches. Free text (filename, address) is validated/normalised on entry.

**Migration list (the `[A]` → `[D]` plan):** intake is the only agentic step, and it
becomes deterministic the moment it is a fixed multiple-choice form with validated free
fields. Log every answer as structured data (see `job-state/`) so today's agentic intake
runs become tomorrow's deterministic test fixtures.

## Config (env)

```
XTRATA_CORE=xtrata-v3-2-3            # or xtrata-v3-2-4 after handover
SVC_STEP=create|status|run|deliver|receipt
SVC_FILE=./user-file.mp4   SVC_URI=xtrata:...   SVC_MIME=video/mp4
SVC_USER_ADDR=SP...                 # recipient of inscription + refund
SVC_MARGIN_USTX=0                    # optional agent fee
JOB_DIR=./job-state   JOB=<jobId>
HIRO_API_KEY=...   DRY_RUN=1   CONFIRM=1
```

## Files in this module

- `SERVICE_SPEC.md` — this document.
- `deposit-service.mjs` — the lifecycle orchestrator (create → watch → run →
  deliver → refund → receipt → wipe), reusing `agent-large-inscribe.mjs`.
- `job-state/` — one JSON per job (public facts; key present only while live, wiped at COMPLETE).
- `../PROGRESSIVE_HARDENING.md` — the agentic-first → deterministic principle this module follows.
