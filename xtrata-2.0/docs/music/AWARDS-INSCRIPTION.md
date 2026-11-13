# Inscribing the awards: five templates, and a record minted at each claim (plan)

Status: plan only, revised 2026-11-13 after Jim's correction. Nothing here has been inscribed, deployed or broadcast.
Jim signs and pays for every mainnet step from the Xtrata project wallet; Claude prepares files, contract, scripts,
dry runs and checks.

**The correction:** a record carries the claimer's address and BNS name, so it cannot exist before the claim. Records
are therefore inscribed one at a time, at the moment each award is claimed. Only the five templates are inscribed in
advance. (The first draft of this plan pre-minted all 1,000; that is withdrawn.)

Read with `AWARDS-PLAN.md`. This plan replaces that plan's "the award is a separate NFT" with "the award is the
Xtrata record itself"; everything Jim decided there still holds.

## The idea in one paragraph

The five award models in `public/awards/` are inscribed once each on Xtrata: the **templates**. When a player has
earned its award and presses Claim, one transaction inscribes its **record**: about 300 bytes of HTML that names the
template and carries that player's number, address, BNS name, paid plays and seed, fixed for good. The record is an
ordinary Xtrata inscription, so it is a standard transferable NFT that shows in the Xtrata explorer and in the
holder's wallet, and its plaque needs nothing looked up to read correctly.

## What a record is

```html
<!doctype html><meta charset=utf-8><title>Xtrata Music Hero · Gold record No. 0412 · jim.btc</title>
<style>html,body,iframe{margin:0;width:100%;height:100%;border:0;background:#040509}</style>
<iframe src="/i/GOLD_TEMPLATE_ID#n=412&a=SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7&b=jim.btc&p=50&s=9f3a61c2"></iframe>
```

- `/i/<id>` is Xtrata's short address for an inscription's own bytes, made for this kind of reference.
- `n` wall number, `a` claiming address, `b` BNS name (left out if there is none), `p` paid plays, `s` seed. These are
  exactly what the templates already read, plus the seed.
- The record is minted with the template declared as its dependency, so the chain says what it is built from.
- It is a snapshot of the moment of the claim. A BNS name gained or changed later does not alter it, and if the record
  is sent to someone else it still names the player that earned it. That is what an engraved award does.

## What the seed does

Today every copy of a template looks identical (the scatter uses one fixed number). The seed replaces that number, so
each record is its own pressing while staying unmistakably its class: where and when the glints catch, the shape of
the smoke and the drift of the dust, the Diamond's deal of light and dark facets, the angle the case rests at, and
where the track gaps fall in the grooves.

The seed is fixed in the record, so a record looks the same every time, on every device. It is taken from the claim
itself (the first 8 hex characters of SHA-256 of `xtrata-music-hero:<drop>:<wall number>:<address>`), so nobody
chooses it and anyone can check it.

## How a claim works

The player cannot pay Xtrata's inscription fee: by the contract's defaults it is 0.102 STX, and a Classic player holds
0.0205 STX in total. So the award contract does the inscribing and pays that fee from a balance Xtrata gives it.

1. The player has made 10% of its plays and presses **Claim your record**.
2. The server builds the record's exact bytes (number, address, the BNS name it finds at that moment, plays, seed) and
   signs a note: this address, this class, this wall number, these plays, and the hash of exactly these bytes.
3. The player sends one transaction to the award contract carrying the note and the bytes.
4. The contract checks the signature, checks this wall number and this address have not claimed before, and then, as
   itself: inscribes the bytes on Xtrata (the core checks they match the hash), pays Xtrata's fee from its own
   balance, and transfers the new inscription to the player. It records `{class, wall number, plays, claimer, token id}`.
5. The player now owns the record. Its player keeps its class look for as long as it holds one.

What this needs from the core (`xtrata-v3.2.3.clar`, read from source): a contract may inscribe while the core is not
paused, the fee is charged to whoever inscribes, and a token is transferred by its owner. All three allow this. To be
proven in the rehearsal, not assumed.

No hot wallet: the server's key only signs notes. It cannot inscribe or move anything by itself, and a note is good
for one address and one exact set of bytes.

## Why the lottery stays secret

Nothing about a player's class is on the chain until that player claims its award, which is after the player itself
was claimed.

## Cost

From the contract source; the live settings have not been read and must be before any spend.

| What | When | Who pays | How much |
|---|---|---|---|
| 5 templates (12 to 16 KB, one chunk each) | once | Xtrata wallet | 0.102 STX each by default, waived if that wallet is the core's royalty recipient |
| Deploy the award contract | once | Xtrata wallet | network fee only |
| Xtrata's fee for each record | each claim | the award contract's balance | 0.102 STX by default, paid to Xtrata's royalty recipient |
| Network fee for each claim | each claim | the player | estimated 600 to 1,000 microSTX (two or three plays); to be measured |

So the award contract needs a balance of about 0.102 STX per expected claim: about 102 STX if all 1,000 claim. That
money is not spent in the usual sense: every claim sends it to Xtrata's royalty recipient. But it has to be put in
first, and it only comes back to wherever that recipient is. It can be added in stages as claims come in, and what is
never used can be withdrawn by the contract's owner.

Ways to make that smaller, all Jim's call: lower the core's single-transaction fee (it applies to everyone inscribing,
not only awards); fund in stages; or give awards to the top classes only.

## Steps

### 1. Finish the templates (Claude; nothing on-chain)

- Add the seed input (`s`); everything scattered or timed reads it.
- Check all five in Safari and on a phone, at full size and small. Fix what that turns up.
- Jim signs off the look. **After this the files must not change: an inscription is permanent.**

### 2. The award contract (Claude writes and tests in simulation)

- `claim`: verify the note, inscribe as the contract, pay the fee, transfer to the claimer, record the claim.
- Owner only: set the signer, set the template id per class, pause, withdraw unused balance, hand over ownership.
- Tests: a forged note, a note for another address, changed bytes, a second claim, an empty balance, a paused core.

### 3. Rehearse off mainnet (Claude prepares; a disposable wallet; no mainnet)

- Inscribe one template, deploy the contract, fund it, claim two records with throwaway players.
- Open the records in the explorer, in the in-app viewer, and as a bare `/i/<id>` address: each must draw the template
  with the right plaque and seed. Measure the real fees.

### 4. Inscribe the five templates (Jim, Xtrata wallet)

- One `mint-single-tx` each, mime `text/html`. Claude supplies the exact bytes, each file's SHA-256, and a script that
  reads each inscription back from the chain and confirms it is byte-for-byte the file that was signed off.

### 5. Deploy and fund (Jim)

- Deploy the award contract, set the five template ids and the signer, send it its first balance.

### 6. Switch on claiming

- Server: build the record bytes, look up BNS, count paid plays on-chain, sign the note. If plays or BNS cannot be
  read it says so and signs nothing (a missing BNS name is not an error: the record is made without one only when the
  lookup answered "none").
- Wallet box: two new actions, claim and send, with their security review. Player screens. As in `AWARDS-PLAN.md`.
- A canary first: Jim claims one record with a real player before it is offered to everyone.

## Open questions to settle in the rehearsal

1. **Does `/i/<id>` resolve from inside every place a record is shown?** In-app frames are sandboxed
   (`allow-scripts`, no same-origin). If a viewer shows inscriptions from a blob or injected markup, a relative
   address may not resolve there and the record needs the viewer's own way of asking for parent bytes.
2. **Does the part after `#` survive** in each viewer? The plaque details and seed travel there.
3. **The live fee settings and royalty recipient** (see Cost).
4. **The size of a claim transaction** and so its network fee: it carries the note and about 300 bytes of record.

## Decisions for Jim

1. Fund the award contract with about 0.102 STX per claim (this plan), lower the core's fee, or limit awards to some classes.
2. A record is a snapshot (recommended): the name and address on it never change, even if it is sent on.
3. If a player has no BNS name at claim time: mint with the address only (recommended), or let them wait and claim once they have a name.
