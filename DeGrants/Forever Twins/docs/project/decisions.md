# Decision log

| # | Date | Decision | Why |
|---|---|---|---|
| D1 | 2026-09-25 | "Preserved" = helper deployed and usable by anyone, record complete and finalised; not the whole collection inscribed. Aim for a handful of real users per collection. | Achievable in the grant window; the art can be inscribed on demand. Pending DeGrants confirmation. |
| D2 | 2026-09-25 | Seed the **full** canonical record before finalising. | Finalising is one-way; missing tokens could never be inscribed. |
| D3 | 2026-09-25 | Fee is a flat 1 STX per inscription at launch. | Simple for holders. |
| D4 | 2026-09-25 | Fee split 50/50 between Jim and Rapha, hardcoded at deploy. | Any fee change affects both equally; payouts cannot be redirected. |
| D5 | 2026-09-25 | One owner (Jim) sets the fee; no multisig. | Simplicity. The fixed split protects Rapha; the cap protects users. |
| D6 | 2026-09-25 | Fee must be even and at most a fixed cap. | Equal halves always; a stolen key cannot price users out. |
| D7 | 2026-09-25 | No pause, no free threshold, no fee-recipient setting. | Fewer admin powers to trust or lose. |
| D8 | 2026-09-25 | Two-step ownership handover. | A mistyped address cannot lose the admin role. |
| D9 | 2026-09-25 | Keep the stray-only, time-locked rescue, held by the owner; rely on the UI to prevent strays. Accept it may one day become unusable. | The contract cannot learn who sent a stray, so no self-regulating undo is possible; permissionless or voting variants were rejected as unsafe or unworkable. |
| D10 | 2026-09-25 | No function for payees to change their own payout address. | A lost key cannot sign a change either; choose well-backed-up addresses instead. |
| D11 | 2026-09-25 | Swaps can never be paused or frozen; only inscribing ends, automatically, when every token has a twin. | Holders must always be able to swap back. |
| D12 | 2026-09-25 | v3 is a new template; v2 kept as tested reference. | Keeps the evidence trail intact. |
| D13 | 2026-09-25 | Registry lists only helpers matching the published template, one per collection. | Trust anchor for self-serve deployments; prevents double twins. |
| D14 | 2026-09-25 | Art over 512 KB uses the same v3 helper: the owner pre-inscribes it through the core's multi-tx upload and binds it with `bind-preinscribed` before finalising; finalising requires every large entry bound. Record entries allowed up to 32 MiB. | Jim's call: lets collections like See Yourself Out and Bitcoin Monkeys use one contract. The binding checks the core's hash, size, mime and token-uri, so the "record fixes the twin" guarantee holds. Owner pays the core fees for those files; no helper fee. |
| — | later | Merkle-root record instead of on-chain seeding, for large collections. | Removes the seeding window; new code, not for Milestone 1. |
