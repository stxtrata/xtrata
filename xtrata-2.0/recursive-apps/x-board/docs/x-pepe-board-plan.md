# Bitcoin Pepe Twins Board — Plan

A dedicated edition of X-Board reserved for the **Bitcoin Pepe twins** inscribed
with Xtrata. It is a standalone, no-build HTML app:
[`../x-pepe-board.html`](../x-pepe-board.html). It shares X-Board's Xtrata
inscription conventions but is intentionally a *fresh* file — none of the
StacksBoard OG/legacy layout, transfer-memo takeover model, or BNS resolver
baggage carries over.

## Decisions (locked)

| Question | Choice |
|---|---|
| Who can claim | Only wallets that **hold a Pepe twin** (on-chain wallet check) |
| Layout | **Mixed square tiers** — all squares, since every Pepe is square |
| Starting point | **Fresh standalone HTML** |
| Cost to claim | **Free** — Stacks network gas only |

## Layout

A deterministic seeded packer fills a `25 × 25` logical grid (625 cells) with
mixed square tiers. The seed (`1337`) and tier plan are immutable once live —
slot IDs are assigned in placement order and must stay stable.

| Tier | Size | Count | Cells |
|---|---:|---:|---:|
| Flagship | `5 × 5` | `1` | `25` |
| Large | `4 × 4` | `4` | `64` |
| Medium | `3 × 3` | `10` | `90` |
| Small | `2 × 2` | `44` | `176` |
| Mini | `1 × 1` | `270` | `270` |
| **Total** | | **329** | **625** |

`329` claimable squares ≈ one per Pepe twin, with room to grow, and a spread of
sizes so the board reads as a varied mosaic rather than a uniform grid. The
packer is verified to produce zero overlaps and full grid coverage.

## Pepe gating (on-chain wallet check)

On wallet connect the board reads the connected Stacks address's NFT holdings
from Hiro and intersects them with the Pepe-twin inscription set. Claiming is
unlocked only if the wallet holds at least one Pepe; the claim then displays one
of the wallet's owned Pepes.

Two values must be supplied before launch (config panel in the app, persisted to
`localStorage`, and mirrored in the `DEFAULT_CONFIG` block of the HTML):

1. **`pepeAssetIdentifier`** — the NFT asset id of the Pepe collection, in
   `"<contract>::<asset-name>"` form (e.g.
   `SP2CWY47KCSYT6VZDV8CZ1WSBA5JASPHDP95ADB96.xtrata-v2::<asset>`). This is what
   Hiro's `/extended/v1/tokens/nft/holdings` filter uses.
2. **Pepe inscription IDs** — the exact set of Pepe-twin IDs, given as ranges
   (`1-329`) and/or an explicit list. The current `1..329` range is a
   **placeholder** so the UI is explorable; replace it with the real IDs.

Until those are set, the app runs in explore/demo mode: an operator can press
**Demo: simulate holding Pepes** to load a sample of the configured IDs and walk
the full claim flow without a live collection.

## Economics

Claims are free. In live mode the board packages a `0`-STX `claim-slot` contract
call under deny-mode post-conditions with **no** post-conditions attached, so no
STX can move — the holder only pays the network fee. There is no bidding, no
outbidding, and no protocol fee, unlike the main X-Board.

## Claim flow

1. Connect a Leather/Xverse-compatible wallet.
2. The board scans holdings and shows the wallet's Pepes.
3. Click an open square → choose which owned Pepe to display → preview.
4. **Claim square — free** packages the wallet call (or records locally in demo
   mode). The square renders the Pepe inscription via
   `https://xtrata.xyz/inscription/{id}`.
5. The owner can **Release square** at any time.

## On-chain registry

The free, Pepe-gated claim is enforced by a Clarity registry draft:
[`../xpepe-clarinet-suite/contracts/xpepe-board-v1.clar`](../xpepe-clarinet-suite/contracts/xpepe-board-v1.clar).
It records slot ownership, requires a direct wallet call, verifies the claimed
inscription is an admitted Pepe and is owned by the caller, and moves no STX.
Set `CONFIG.boardContract` in the HTML to its deployed identifier to switch the
app from demo mode to live claims.

## Before launch

1. Pin the real `pepeAssetIdentifier` and Pepe inscription IDs.
2. Confirm the Xtrata ownership read-only signature used by the registry
   (`get-owner` vs project-specific) and wire it in.
3. Deploy `xpepe-board-v1` to testnet; run real holder and non-holder claim,
   release, and rejection sessions across Leather and Xverse.
4. Independent contract review before mainnet, matching the main board's gate.
