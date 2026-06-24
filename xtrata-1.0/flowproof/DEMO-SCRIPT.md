# FlowProof — demo video script (~75 seconds)

Goal: show that **money movement and its permanent, verifiable proof happen
together** — and that anyone can independently verify it. Tight, evidence-first.

## Prep (before recording)
- Terminal in `flowproof/`, font size up. Contracts already deployed, account funded.
- Pre-run `npm run lineage 11` so `lineage.json` is fresh, and have `explorer.html`
  open in a browser tab (served via `npx serve .`), hard-reloaded.
- Have the Hiro testnet explorer open on the atomic tx
  `0x846ffe6a…` in another tab.
- Optionally pre-warm so on-camera commands return fast.

---

### Shot 1 — Hook (0:00–0:10)
**Screen:** `explorer.html`, the full lineage (asset#8 → R9 → R10 → R11).
**Voiceover:**
> "This is a treasury that documents itself. Every payment FlowVault routes mints
> its own permanent proof on Xtrata — a financial record that can't be edited or lost."

### Shot 2 — The atomic transaction (0:10–0:30)
**Screen:** terminal — run `npm run demo:atomic` (or scroll the prior output to the
two atomic sales).
**Voiceover:**
> "Watch one transaction. `deposit-and-prove` routes a 5-USDCx sale through
> FlowVault — splitting to a collaborator, locking a reserve — *and* inscribes a
> recursive receipt on Xtrata. One on-chain action. Both, or neither."

**Screen:** click into the atomic tx on the Hiro explorer — show the single tx
contains the FlowVault `deposit` event **and** the Xtrata mint.

### Shot 3 — The lineage (0:30–0:48)
**Screen:** back to `explorer.html`. Point at the cards: asset → R9 → R10 (atomic
badges) → R11 (withdrawal).
**Voiceover:**
> "Each receipt is stored fully on-chain and linked to the work and the receipt
> before it. Deposits, splits, time-locks, withdrawals — the whole money lifecycle,
> one verifiable chain."

### Shot 4 — Don't trust, verify (0:48–1:05)
**Screen:** terminal — run `npm run verify 10`. Let the four PASS lines land.
**Voiceover:**
> "And you don't have to trust us. The verifier re-derives the receipt's hash from
> on-chain bytes, checks the lineage, matches the amounts to the real FlowVault
> event — and proves the money and the record were the same transaction. All pass."

### Shot 5 — Why it matters (1:05–1:15)
**Screen:** `explorer.html` footer ("13 USDCx routed … provable forever").
**Voiceover:**
> "FlowVault moved the money; Xtrata made it provable forever. One primitive —
> royalties today, payroll and DAO treasuries next. That's FlowProof."

---

## One-take terminal sequence (if doing it live)
```bash
npm run demo:atomic     # 2 atomic deposit-and-prove + a withdrawal receipt
npm run verify 10       # PASS x4 incl. atomicity
npm run lineage 11      # refresh lineage.json, then show explorer.html
```

## Caption / description (for the upload)
> FlowProof turns every FlowVault money movement into a permanent, recursively-linked
> on-chain receipt via Xtrata v3.2.3. The flowproof-treasury contract routes a deposit
> and inscribes its proof in a single atomic transaction; an independent verifier
> confirms integrity, lineage, and that the amounts match the real FlowVault event.
> Live on Stacks testnet. Built for the FlowVault Builder Bounty.

## 10-second elevator version (if a short is needed)
> "FlowProof: self-documenting money on Stacks. One transaction routes a FlowVault
> payment and mints its permanent, verifiable Xtrata receipt — and anyone can audit
> the whole money lineage on-chain."
