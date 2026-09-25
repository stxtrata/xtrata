# Grant overview

Source: the official Stacks Endowment grants tracker page, read 25 September 2026.

| Field | Value |
|---|---|
| Project | Xtrata - Forever Twins |
| Programme | Stacks Endowment Grants, tracker powered by Zero Authority |
| Track | Community DeGrants |
| Cohort | DeGrants Cohort 4 |
| Category | Creative / cultural project |
| Timeline | Q3 2026 |
| Status | In-Progress (tracker shows 0% complete) |
| Grantee | Jim |
| Link | https://x.com/XtrataLayers |
| Tracker | https://grants.stacksendowment.co/projects/bb0dcef3-08df-47f3-ad17-bcc42c2815a4 |

## What the grant funds

Open, reusable preservation infrastructure for Forever Twins:

- a **self-serve deployer** so any collection can stand up its own Forever Twins contract
- a **public registry** of preserved collections
- **documentation**
- a **drive to preserve at-risk collections**

Holders pay a modest fee in STX to preserve a twin (USDCx and sBTC support planned), which keeps
the service running after the grant. The tooling and registry stay open and reusable. Inscription
cost, which scales with file size, is passed through transparently. It builds on Xtrata's live
mainnet data layer (`SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`).

## Problem stated in the application

Most NFTs store only a token ID and a URI on-chain; the artwork usually lives on IPFS or
centralised servers. When pinning lapses or a host shuts down, the token survives but points at a
dead link: link rot applied to culture, which has already left roughly one in five NFTs pointing
at broken links. Lost art cannot be recovered, so it has to be preserved beforehand. Forever Twins
adds a permanent on-chain twin without modifying the original.

## Stacks relevance stated in the application

- Permanence on Bitcoin is something no other chain can credibly match; Stacks makes it
  programmable and ownable.
- It gives collections, including ones from other chains, a concrete reason to come to Stacks:
  genuine ecosystem inflow.
- It is a flagship demonstration of Stacks inscriptions plus a data layer, and every preserved
  collection is a public-good addition to the on-chain cultural record.

## Wording to keep accurate

The application says twins are "verified against the source art's on-chain hash". Most source
collections do not store an art hash on-chain. What is actually on-chain is the helper's
**finalised canonical record** (a content hash per token) plus the **manifest hash** of the
published off-chain manifest. Public docs should describe it that way. See
[../project/architecture.md](../project/architecture.md).
