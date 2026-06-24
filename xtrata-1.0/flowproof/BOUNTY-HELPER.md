# FlowProof — Bounty Application Helper

Everything you need to submit to the **FlowVault Builder Bounty** ($1,000 USDT) correctly and tick every box. Fill the three `<PLACEHOLDER>` links, then submit.

- **Submission deadline:** June 28, 23:59 UTC
- **Judging:** June 29–30 · **Winners:** July 1

---

## 1. The pitch (paste this)

**FlowProof — self-documenting money on Stacks.** Every FlowVault money movement mints its own permanent, verifiable, recursively-linked proof on Xtrata.

On-chain treasuries move money well, but their *history* lives in mutable indexers you have to trust. FlowProof makes the proof a first-class output of every flow: **FlowVault** routes the money (split → time-lock → hold), and **Xtrata** inscribes a canonical receipt — stored fully on-chain, content-addressed, and recursively linked to the work and the previous receipt. The result is a permanent **financial lineage** (`asset ← R1 ← R2 ← …`) that can't be edited or lost and that anyone can independently verify against the real on-chain money events.

The headline: a `flowproof-treasury` contract whose **`deposit-and-prove` routes a FlowVault deposit and inscribes the Xtrata receipt in a single atomic transaction** — both succeed or both revert. This is the composable primitive, live on testnet, with an independent verifier that proves it.

*Why uniquely Xtrata × FlowVault:* FlowVault is the programmable money layer; Xtrata is a contract-native inscription protocol with full on-chain storage + recursive relationships. A linked, self-contained audit trail of money flows is impossible without both. The composition is the moat.

---

## 2. How FlowProof ticks every box

### FlowVault primitives used
| Primitive | Where it shows in FlowProof |
|---|---|
| 🔒 Time Locks | `lock-amount` + `lock-until-block` on each routing rule (receipts show "Locked → block 4022241, 1 USDCx") |
| 🔀 Fund Splits | `split-amount` to a collaborator (0.5 USDCx → `ST2CY5…`) each deposit |
| 🏦 Treasury Routing | `set-routing-rules` → deposit pipeline split → lock → hold |
| ⚡ Automated Payouts | Autonomous orchestrator **and** atomic `deposit-and-prove`; withdrawals included |

### What they're *especially interested in*
| Vertical | FlowProof |
|---|---|
| Creator revenue flows | ✅ **Flagship** — inscribe a work, route sales, mint recursive royalty receipts |
| Payroll & compensation | ✅ Same engine (vesting lock + split to collaborators) — config only |
| DAO treasury automation | ✅ Same engine — auditable, self-documenting payouts |
| Goal-based savings | ✅ Time-lock until block + milestone receipt |
| AI treasury agents | ▶ Roadmap — orchestrator is already an autonomous signer; next step inscribes each decision + rationale |
| Experimental financial systems | ✅ "Proof-of-Flow" is itself a new primitive |

### What they *value*
| Value | FlowProof |
|---|---|
| Financial behavior design | New behavior: money that documents itself |
| Automation | One-tx atomic deposit-and-prove; zero manual record-keeping |
| Composability | FlowVault × Xtrata composed in a single on-chain transaction |
| Ecosystem value | Generic across verticals; makes *FlowVault itself* auditable for free |
| Deep FlowVault integration | Real routing pipeline, `get-vault-state`, token-trait `deposit`, post-conditions |

### What they're *NOT* looking for — and why we're clear
| Rejected | Why FlowProof isn't this |
|---|---|
| Generic dashboards | The explorer is a provenance **lineage** view, not a vault dashboard |
| Wallet wrappers | No wallet wrapping; it's a money+proof primitive |
| UI clones of existing demos | The recursive receipt lineage has no existing demo |
| Simple deposit interfaces | Deposit is one step inside an atomic, verifiable behavior |

---

## 3. Links (with explanations)

### Fill these in before submitting
| Link | What it is | Status |
|---|---|---|
| `<REPO_URL>` | Your public GitHub repo (push the `flowproof/` folder as its own repo, or link the subfolder of your xtrata repo) | ⬜ push + paste |
| `<VIDEO_URL>` | The demo video (record `demo-reel.html`, upload to YouTube/Loom) | ⬜ record + paste |
| `<TELEGRAM/REGISTRATION>` | The bounty's registration/submission channel from the original post | ⬜ confirm |

### On-chain evidence (testnet) — live and verifiable
Explorer base: `https://explorer.hiro.so/...?chain=testnet`

| Link | What it proves |
|---|---|
| [Deployer address](https://explorer.hiro.so/address/STRNRHWSD7REAEXVTHDQWKPD4MFBG41024WQKBBM?chain=testnet) | All FlowProof contracts under one principal |
| [`flowproof-treasury`](https://explorer.hiro.so/txid/STRNRHWSD7REAEXVTHDQWKPD4MFBG41024WQKBBM.flowproof-treasury?chain=testnet) | The atomic composer (`deposit-and-prove`) — **the headline** |
| [`xtrata-v3-2-3`](https://explorer.hiro.so/txid/STRNRHWSD7REAEXVTHDQWKPD4MFBG41024WQKBBM.xtrata-v3-2-3?chain=testnet) | The record layer (on-chain inscriptions + recursive lineage) |
| [`flowvault-v2`](https://explorer.hiro.so/txid/STD7QG84VQQ0C35SZM2EYTHZV4M8FQ0R7YNSQWPD.flowvault-v2?chain=testnet) | The money layer you built on |
| [Atomic tx → receipt #10](https://explorer.hiro.so/txid/0x846ffe6a696432345ee3eaf819327395d2d859ab2d35cc17700e5018be2c73fa?chain=testnet) | **One tx** with the FlowVault deposit event **and** the Xtrata mint |
| [Atomic tx → receipt #9](https://explorer.hiro.so/txid/0xbe12e2843a5896eda9834d01dab9da9b39c587d2a49a4f3cde2ccd97acc3e07b?chain=testnet) | Second atomic deposit-and-prove |
| [Withdrawal receipt #11](https://explorer.hiro.so/txid/0xeffbfc7021edd9cb9d43153ace946ed1f54c53689168173bf1036fdbb01bc21b?chain=testnet) | Full lifecycle (withdraw) also inscribed + linked |
| [Asset #8](https://explorer.hiro.so/txid/0x5c6c3e7f0089e9b63869180a50557d5f14e038a3554a5d93eb37ee55a6e11ad1?chain=testnet) | The inscribed work every receipt links back to |

Lineage: **`asset#8 ← R9 ← R10 ← R11`** — every receipt independently verified (`npm run verify` → integrity, lineage, money, atomicity all PASS).

### Built on
- FlowVault docs: https://docs.flow-vault.dev · FlowVault GitHub: https://github.com/yashpunmiya/Flowvault
- Xtrata: https://xtrata.xyz · Stacks: https://stacks.co

---

## 4. What's in the submission repo (`flowproof/`)
| File | Purpose |
|---|---|
| `SUBMISSION.md` | The full written submission (pitch + evidence + criteria map) |
| `README.md` | Run guide + layout + judging-criteria map |
| `docs/ARCHITECTURE.md` | Design: Proof-of-Flow, Pattern A/B, verifier, trust model |
| `DEMO-SCRIPT.md` | 75-second video treatment |
| `demo-reel.html` | Self-running demo recreation (record this for the video) |
| `explorer.html` | Live on-chain lineage visualizer |
| `contracts/flowproof-treasury.clar` | Atomic `deposit-and-prove` (Pattern B) |
| `contracts/flowproof-usdcx.clar` | Faucet SIP-010 test token (testnet stand-in) |
| `src/`, `scripts/` | Orchestrator, clients, verifier, demos, deploy/faucet tooling |

---

## 5. Apply — step by step

1. **Confirm you're registered.** Onboarding ran June 15–21 via the FlowVault registration link / Telegram in the bounty post. If you registered, you're set; if not, join now via that link.
2. **Push the repo public.** `git add flowproof/ && git commit -m "FlowProof — Proof-of-Flow" && git push`, then make sure it's public. Paste the URL into `<REPO_URL>` (here + in SUBMISSION.md links).
3. **Record the video.** Open `demo-reel.html` fullscreen, press Space, screen-record the 75s, add your voiceover (DEMO-SCRIPT.md). Upload (YouTube unlisted / Loom). Paste into `<VIDEO_URL>`.
4. **Submit** through the channel named in the bounty post (FlowVault registration page / Telegram group; if it's hosted on a platform like DoraHacks, submit the project there). Include: project name (FlowProof), the pitch (§1), repo URL, video URL, and the on-chain evidence links (§3).
5. **Beat the clock:** submit before **June 28, 23:59 UTC** — don't cut it close.

---

## 6. Copy-paste submission blurb
> **FlowProof — Proof-of-Flow.** Self-documenting money on Stacks: every FlowVault flow mints its own permanent, recursively-linked proof on Xtrata. Our `flowproof-treasury` contract routes a FlowVault deposit **and** inscribes the Xtrata receipt in one atomic transaction; deposits, splits, time-locks and withdrawals all become a verifiable on-chain lineage, checkable by an independent verifier. Live on Stacks testnet.
>
> Repo: `<REPO_URL>` · Demo: `<VIDEO_URL>`
> Treasury: `STRNRHWSD7REAEXVTHDQWKPD4MFBG41024WQKBBM.flowproof-treasury`
> Atomic tx evidence: explorer.hiro.so/txid/0x846ffe6a…?chain=testnet

---

## 7. Pre-submit checklist
- [ ] Registered for the bounty (or confirmed eligibility)
- [ ] Repo public; `<REPO_URL>` pasted into BOUNTY-HELPER.md + SUBMISSION.md
- [ ] Video recorded (from `demo-reel.html`) + uploaded; `<VIDEO_URL>` pasted
- [ ] `SUBMISSION.md` reviewed (links resolve)
- [ ] On-chain links open on Hiro testnet explorer
- [ ] `npm run verify 10` shows 4× PASS (re-run if you want a fresh screenshot)
- [ ] Submitted via the bounty channel before June 28 23:59 UTC

---

## 8. Reproduce in 5 commands (for judges)
```bash
cd flowproof && npm install
cp .env.example .env            # add STACKS_PRIVATE_KEY (or seed)
npm run deploy-token            # faucet USDCx stand-in
npm run faucet 1000             # mint test USDCx
npm run deploy-treasury         # the atomic composer
npm run demo:atomic             # atomic deposit-and-prove x2 + withdrawal receipt
npm run verify <receiptId>      # independent on-chain audit
npm run lineage && npx serve .  # open explorer.html
```

## 9. Honest notes (pre-empt judge questions)
- **Test token:** official testnet USDCx is a Circle CCTP bridge token (no faucet), so the demo uses a freely-mintable SIP-010 stand-in (symbol `USDCx`). FlowVault is token-agnostic — on mainnet point at the real `SP120…usdcx`, nothing else changes.
- **Xtrata deploy:** testnet `xtrata-v3-2-3` is the live v3.2.3 with legacy (mainnet-only) migration removed; every function FlowProof uses is byte-identical.

## 10. Only you can confirm
- Exact public **repo URL** and **video URL** (placeholders above).
- **Registration status** and the **exact submission portal/Telegram** (from the bounty post — the link was truncated in the screenshot).
