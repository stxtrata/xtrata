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

## Decided (Jim, 2026-11-13)

1. **Funding.** The award contract pays Xtrata's fee for every record from its own balance. Jim tops that balance up
   from the sponsorship wallet (about 0.102 STX per expected claim, in stages). The money sits in the contract, not
   behind a key on the server: Claude never holds or uses the sponsorship wallet.
2. **A record is fixed to the Music Hero who paid those plays.** The number, address, name and plays on it never
   change, whoever holds it later.
3. **No BNS name at claim time: mint with the address only.**

Note: a sponsored transaction can only cover the network fee, not Xtrata's own fee, which is why the balance has to
be in the contract. The sponsorship service could also pay each claim's network fee so that claiming costs the
player nothing at all; that is optional and not in this plan yet.

## Done so far

- **The award contract is written and passes in simulation** against the real core source: `contracts/live/xtrata-music-awards-v1.0.clar`,
  tests in `contracts/clarinet/tests/xtrata-music-awards-v1.0.test.ts` (15 tests; run with `npx vitest run tests/xtrata-music-awards-v1.0.test.ts`
  from `contracts/clarinet/`). Not deployed anywhere. What the tests show:
  - a genuine claim inscribes the exact record bytes as HTML with the template as its dependency, takes 0.102 STX from the
    contract's balance to Xtrata, and leaves the inscription owned by the hero;
  - refused, with nothing inscribed, paid or recorded: a note signed by another key, a note used by another address, a record
    changed by one character, a changed class, number, play count or drop, a note made for another deployment, a second claim
    by the same hero or for the same wall number, a claim past the class cap, a claim when the balance cannot cover the fee;
  - the award can be transferred like any inscription and still names the hero who earned it;
  - only the owner can change settings or withdraw; while the core is paused claims stop unless Xtrata allow-lists the contract.
  - Each safety check was also removed in turn to confirm the tests fail without it.
- **Size of a claim:** the record is about 280 to 300 bytes and the whole claim transaction about 600 to 620 bytes before its
  post-conditions (measured by building one). At roughly 1 microSTX per byte that is under 1,000 microSTX: two or three plays.
  The real fee still has to be seen on testnet.
- **Error numbers** (for the player's messages): 200 not owner, 201 paused, 202 no signer set, 203 note not valid, 204 wall
  number already claimed, 205 this address already has its award, 206 class not set, 207 class full, 208 empty record,
  209 bad arguments. Below 200 the error is the core's own (109 paused, 111 template missing) or 1 (balance cannot cover the fee).
- **A record opening its template, tried locally** (a small server standing in for the gateway, the real Gold template, a
  record built exactly as the contract tests build it, in Chromium). The template drew with the right plaque
  ("Gold record · No. 0412 · jim.btc · SP10W2…69TM7 · 50 paid plays") when the record was: opened at its own address;
  opened with the site's isolation header; shown in a sandboxed frame pointed at its address; shown in a sandboxed frame
  given its markup (`srcdoc`, which is how the app's main preview shows HTML); written into the page by a launcher.
  **It did not draw when the record was shown from a `blob:` address**: a `/i/<id>` reference has nothing to resolve
  against there. Any surface that shows inscriptions from a blob would show an empty record. To settle before
  mainnet: either confirm no surface does that for HTML, or have the record fall back to the full
  `https://xtrata.xyz/i/<id>` address when it finds itself in a blob (about 80 more bytes per record).
- **The testnet rehearsal ran on 2026-11-14: 14 of 14 checks passed.** `contracts/clarinet/scripts/awards-testnet-rehearsal.mjs`
  made its own throwaway wallets, used the faucet, deployed the core as the simulation uses it, inscribed the Gold and
  Diamond templates (ids 0 and 1), deployed and funded the award contract, and made two claims (Gold No. 412 with a
  name, 309 bytes; Diamond No. 7 with the address only, 279 bytes). A forged claim was refused (u203) and a second
  claim by the same hero was refused (u205). A record was sent on and still names the hero who earned it; the unused
  balance was withdrawn. Both templates read back byte-for-byte; each record declares its template as its dependency.
  Fees really paid at 1 microSTX per byte: a claim 626 to 656 microSTX, paid by the hero; the contract paid the
  Xtrata fee of 0.102 STX per record from its balance (1 STX in, 0.796 left after two). Whole run, deploys included:
  about 0.16 STX in network fees. Run through the site's own testnet proxy:
  `NODE_USE_ENV_PROXY=1 STACKS_API=https://xtrata.xyz/rpc-testnet node scripts/awards-testnet-rehearsal.mjs`.
- **Seen in the rehearsal:** the templates print only mainnet addresses (SP or SM) on the plaque, so a testnet
  record shows its name, class, number and plays but no address. On mainnet the address shows. Deliberate for now.
- **Still to show:** the record drawing in the live app's own viewers on mainnet.

- Templates read the seed (`s`): same seed, same record, every time; a different seed, a visibly different record in
  the same class. Checked for all five (identical on reload; a bad seed falls back to the standard look).
- With the seed code the Diamond template is 16.5 KB, just over one 16,384-byte chunk, so it inscribes as two chunks
  (0.002 STX more by the default fees). The other four are one chunk.
