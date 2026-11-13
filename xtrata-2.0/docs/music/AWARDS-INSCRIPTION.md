# Inscribing the awards: five templates, 1,000 records (plan)

Status: plan only, written 2026-11-13. Nothing here has been inscribed, deployed or broadcast. Jim signs and pays for
every mainnet step from the Xtrata project wallet; Claude prepares files, scripts, dry runs and checks.

Read with `AWARDS-PLAN.md`. One thing in that plan changes here and needs Jim's yes: see "What changes".

## The idea in one paragraph

The five award models in `public/awards/` are inscribed once each on Xtrata. They are the **templates**. Each of the
1,000 awards is then its own tiny inscription, a **record**: about 250 bytes of HTML that names its template and
carries its own **seed** and edition number. Opening a record loads the template, and the seed makes that one record
different from every other in its class. The record is an ordinary Xtrata inscription, so it is a standard
transferable NFT that shows in the Xtrata explorer and in the holder's wallet.

## What a record is

```html
<!doctype html><meta charset=utf-8><title>Xtrata Music Hero · Gold record 3 of 10</title>
<style>html,body,iframe{margin:0;width:100%;height:100%;border:0;background:#040509}</style>
<iframe src="/i/GOLD_TEMPLATE_ID#s=9f3a61c2&e=3&of=10&d=1"></iframe>
```

- `/i/<id>` is Xtrata's short address for an inscription's own bytes, made for exactly this kind of reference.
- `s` is the seed, `e` of `of` is the edition within its class, `d` is the drop (1 = the 1,000-player giveaway).
- The record is minted with the template declared as its dependency (`mint-single-tx-recursive`), so the chain
  itself says "this record is built from that template".
- Editions: Diamond 1 to 5, Gold 1 to 10, Silver 1 to 20, Bronze 1 to 100, Classic 1 to 865.

## What the seed does

Today every copy of a template looks identical (the scatter uses one fixed number). The seed replaces that number, so
each record is its own pressing while staying unmistakably its class:

- where and when the glints catch on the record,
- the shape of the smoke and where the dust drifts,
- the Diamond's deal of light and dark facets,
- the angle the case rests at and the rhythm of its sway,
- the position of the two track gaps in the grooves, like a fingerprint of that pressing.

Seeds are not secret and not random at view time: the same record looks the same every time, on every device.
Each is taken from a published rule (the first 8 hex characters of SHA-256 of `xtrata-music-hero:<drop>:<class>:<edition>`),
and the whole list is committed in a manifest before minting, so anyone can check a record against it.

## What goes on the plaque

The record file can only know what is true when it is minted: its class, its edition and its seed. Who claimed it,
their BNS name and how many plays they made are only known later. So the plaque fills in three steps:

1. Always, from the file itself: "Xtrata Music Hero", the mark, "Gold record · 3 of 10".
2. Where the page showing it passes details in (the player, the wall): number, name or address, paid plays. This is
   what the templates already accept.
3. Opened on its own (in the explorer, say): the template asks the awards contract who claimed this class and
   edition, and BNS for a name. If either cannot be reached, the plaque stays at step 1. It never shows a guess.

Step 3 is new work in the templates and depends on a public API being reachable from inside an inscription. It is the
one part that is not fully self-contained; steps 1 and 2 are.

## Why the lottery stays secret

A record does not carry a wall number. The chain shows there are 10 Gold records, which is already public. Which
wall spot is Gold stays on the server until that player is claimed. When a Gold player claims its award it is given
the lowest Gold edition still unclaimed, so early claimers get the low numbers.

## How a player gets its record

The 1,000 records are minted by the Xtrata wallet and then placed in a small holding contract. A claim is one cheap
call by the player: it presents the server's signed note ("this address won Gold, wall number 412, after 50 plays"),
and the contract hands over the next Gold record and writes those details down. No hot wallet, no float.

## What changes from AWARDS-PLAN.md (needs Jim's yes)

That plan had the award as a new NFT minted by its own contract, with the art merely pointed at. Here the award is the
Xtrata record itself, and the contract only holds and hands out records. Everything Jim decided still holds: a
standard transferable SIP-009 NFT, earned at 10% of the plays it came with, the player's look follows the award,
Xtrata inscribes and deploys. What is better: the award is a real Xtrata inscription, visible wherever inscriptions
are. What it costs: 1,000 small mints up front (below) and a slightly larger claim call.

## Cost

From the contract source (`xtrata-v3.2.3.clar`); the live settings have not been read and must be before any spend.

| Step | Transactions | Xtrata's own fee | Network fee (estimate, to be measured) |
|---|---|---|---|
| 5 templates (12 to 16 KB, one chunk each) | 5 | 0.102 STX each by default | small |
| 1,000 records (one chunk each, with a dependency) | 1,000 | 0.102 STX each by default: about 102 STX | roughly 0.5 to 1.5 STX in total |
| Put the records in the holding contract (50 per call) | 20 | none | small |
| Deploy the holding contract | 1 | none | small |

The core waives its own fee when the minter is its royalty recipient. If the Xtrata project wallet is that recipient,
the 102 STX is never charged. If it is not, the 102 STX is paid to that recipient, so it is Xtrata paying Xtrata
either way, but the minting wallet must hold it. **Check first: `get-royalty-recipient` and the live fee settings.**

Recursive mints cannot be batched (one record per transaction), and the network only queues about 25 unconfirmed
transactions per wallet, so the 1,000 go out in waves of about 20.

## Steps

### 1. Finish the templates (Claude; nothing on-chain)

- Add the seed (`s`), edition (`e`, `of`) and drop (`d`) inputs; everything that is scattered or timed reads the seed.
- Add the on-its-own lookup for the plaque (step 3 above), with the "stay at step 1" fallback.
- Check all five in Safari and on a phone, at full size and small. Fix what that turns up.
- Jim signs off the look. **After this the files must not change: an inscription is permanent.**

### 2. Rehearse off mainnet (Claude prepares; a disposable wallet; no mainnet)

- Inscribe one template and three records on testnet. Open the records in the explorer, in the in-app viewer, and
  as a bare `/i/<id>` address: all three must draw the template with the right seed.
- This is where the open questions below get answered before any real spend.

### 3. Inscribe the five templates (Jim, Xtrata wallet)

- One `mint-single-tx` each, mime `text/html`.
- Claude supplies the exact bytes, each file's SHA-256, and a check script that reads each inscription back from the
  chain and confirms it is byte-for-byte the file that was signed off.
- Record the five ids in `src/data/awards.json` (new).

### 4. Build the 1,000 records (Claude; nothing on-chain)

- A script writes the 1,000 files from the five template ids and the seed rule, plus a manifest: class, edition,
  seed, file hash, template id.
- A dry run prints the count per class, the total bytes, the expected fees, and refuses to continue if any file is
  not exactly what the manifest says.
- The manifest is committed before anything is minted.

### 5. Mint the 1,000 records (Jim, Xtrata wallet; Claude's script)

- `mint-single-tx-recursive` per record, in manifest order, in waves of about 20.
- The script is safe to stop and restart: it writes each transaction id and resulting token id into the manifest,
  reads every minted record back and checks its hash, and never sends a record twice.
- A canary first: 5 records (one per class), opened and checked, before the other 995.

### 6. The holding contract (Claude writes and tests; Jim deploys)

- Holds the records, hands one out per valid claim note, stores `{class, edition, wall number, plays, claimer}`.
- Deposit the records, 50 per call. A read-only check confirms the contract holds exactly 5, 10, 20, 100 and 865.

### 7. Switch on claiming

- Server notes, the two wallet box actions (claim, send) with their security review, the player screens. As in
  `AWARDS-PLAN.md`.

## Open questions to settle in the rehearsal

1. **Does `/i/<id>` resolve from inside every place a record is shown?** In-app frames are sandboxed
   (`allow-scripts`, no same-origin). If a viewer shows inscriptions from a blob or injected markup, a relative
   address may not resolve there and the record needs the viewer's own way of asking for parent bytes.
2. **Does the part after `#` survive?** The seed travels there. It is inside the record's own markup, so it should,
   but it must be seen working in each viewer.
3. **The live fee settings and royalty recipient** (see Cost).
4. **Token ids.** Records get the next free ids at the moment of minting; other people's mints can land in between.
   Nothing depends on the ids being consecutive, and the manifest records what each one got.

## Decisions for Jim

1. Award = the Xtrata record itself, held and handed out by a small contract (this plan), or the earlier design.
2. The number on the plaque: the edition ("3 of 10"), the wall number ("No. 0412"), or both.
3. Lowest edition to the earliest claimer (recommended), or editions dealt at random.
4. Unclaimed records after the giveaway ends: keep in the contract for later, or return to the Xtrata wallet.
