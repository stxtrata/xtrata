# Music Hero awards: the server side (plan)

Status (14 Nov 2026): the server side below is built and tested (steps 1 to 4 of "Order of work"); it is switched off until the contract is deployed. The client side is not built. It follows `AWARDS-PLAN.md` and `AWARDS-INSCRIPTION.md`; the contract
(`contracts/live/xtrata-music-awards-v1.0.clar`) is written, tested in simulation and rehearsed on testnet.

## What the server is for

The award contract will inscribe a record for anyone who brings it a signed note. The server is the only thing that
signs notes, so it is the judge of three questions and nothing else:

1. Is this address one of the numbered free players, and which class and number is it?
2. Has it really paid for enough plays?
3. What exactly goes on the plaque?

It never holds money and never sends a transaction. Its key can only sign notes; a note is good for one address,
one wall number and one exact set of bytes, and the contract refuses a second claim by itself.

## The three answers

**1. Class and number.** Already on the server: a claimed gift (`radio_gifts.claimed_by`) joined to the giveaway
wall (`radio_giveaway_links`, list `players`, not archived). The number is the disc's place on the wall, the class
comes from the plays the gift carried, exactly as the wall and the player badge already work them out. Any other
address gets "not a wall player".

**2. Paid plays.** Counted from the chain, never from the server's own play counter (that one is for charts and can
be written by any browser). A paid play is a confirmed, successful `play` call on `xtrata-radio-plays` sent by the
player's own address. The server only ever needs to count up to the class's target, so it is a page or two of that
address's transactions.

| Class | Plays in the player | Plays to earn the record (10%) |
|---|---|---|
| Diamond | 1,000 | 100 |
| Gold | 500 | 50 |
| Silver | 250 | 25 |
| Bronze | 100 | 10 |
| Classic | 50 | 5 |

- Plays from the player's own address and from album wallets bound to it all count (decision 1 below).
- The targets in the table are today's setting of 10%; the setting can change until launch (decision 2).
- If the chain cannot be read, the answer is "unavailable": never zero, and nothing is signed.
- A count that has reached the target is remembered for good (it cannot go down); a count below it is re-read, at
  most once a minute per address.

**3. The plaque.** Fixed by Jim's decisions (14 Nov):

- the address on the plaque is the listener address, the one that made the plays;
- a name is added beside it: the listener address's own .btc name if it holds one, otherwise the .btc name of the
  main wallet the player is linked to (`radio` link records, already on the server);
- the listener can choose "use my address": then no name is looked up at all;
- if a name was wanted and the lookup fails, nothing is signed ("try again in a moment"). A record goes out without
  a name only when the lookup answered "none" or the listener chose the address.

The plays figure on the plaque is the class's target when the note is signed: "the plays that earned it".

The record's bytes are built by one shared function, used by the server, by the testnet rehearsal script and by
the tests, so all three always produce byte-identical records: title, the template's inscription number, and
`#n=<number>&a=<address>&b=<name>&p=<plays>&s=<seed>`. The seed is the first 8 hex characters of
`sha256("xtrata-music-hero:<drop>:<number>:<address>")`. The template's number is read from the contract's own
class table, not from a setting, so the server cannot point at the wrong template.

## Endpoints

All under `/radio/awards/`, same-origin, JSON, off unless switched on.

| Call | Answers |
|---|---|
| `GET /radio/awards/config` | on or off, the contract, the drop number, the class targets |
| `GET /radio/awards/status?address=` | where this player stands (below) |
| `POST /radio/awards/note` `{ address, name: "auto" or "none" }` | the record bytes, the note's fields and its signature |
| `GET /radio/awards/record?number=` | for the wall: whether disc N has claimed, and its inscription number |

`status` returns one of:

| State | Meaning | What the page shows |
|---|---|---|
| `not-a-player` | not a numbered wall player | nothing about awards |
| `earning` | `have` of `need` plays | the progress meter |
| `ready` | target reached, not claimed | "Your record is ready", with the name it would carry |
| `claimed` | the contract says so; inscription number, and whether the player still holds it | the Awards shelf; class colours only while it holds the record |
| `unavailable` | the chain or the server's records could not be read | "can't check right now", never a zero |
| `paused` / `class-full` / `off` | straight from the contract or the switch | a plain line |

`note` needs no login. A note is useless to anyone but its address (the contract takes the hero from whoever sends
the transaction), so the only protections needed are rate limits per address and per connection, and the size cap.
The same request returns the same note until the name changes; the note is kept in a small table so a retry after a
closed tab does not sign something new.

"Holds it" (for the rule that a player loses its class colours when the record is sent away) is one read of the
inscription's owner on the Xtrata core, compared with the player's address.

## The signer key

- A new key used for nothing else: secret `RADIO_AWARDS_SIGNER_KEY` in Cloudflare. Jim makes it (one command, on
  his Mac); it never appears in chat, in the repo or in logs. Its address holds no money and needs none.
- The contract stores only that key's hash (`set-signer-hash`). If the key is ever exposed, Jim sets a new hash and
  every unclaimed old note stops working.
- What a thief could do with it: sign notes for addresses that have not earned them. Each still costs the contract
  0.102 STX and is capped by class size and one-per-address, and `set-paused` stops it at once. It cannot move money.

Other settings: `RADIO_AWARDS_ENABLED`, `RADIO_AWARDS_CONTRACT`, `RADIO_AWARDS_DROP` (1). All plain values.

## What is stored

Two small tables, both rebuildable from the chain:

- `radio_award_plays`: address, confirmed plays counted, when checked, whether the target was reached.
- `radio_award_notes`: address, number, class, name, record bytes, signature, when issued.

No personal data beyond what is already public on chain.

## Tests

- The shared record builder: byte-for-byte equal to the two records that were inscribed in the testnet rehearsal.
- The note: the server's signature is accepted by the real contract in the clarinet simulation, and a note for
  another address, number, class, plays or record is refused (the contract tests already cover the refusals).
- Plays: counts only successful `play` calls from the address; stops at the target; a failed read is
  "unavailable"; pending and failed transactions do not count.
- Names: own name wins over the linked wallet's; "none" skips the lookup; a failed lookup signs nothing.
- Every state in the table above, including a record that was sent away.

## Built (14 Nov 2026)

- `src/lib/music-awards/record.ts`: the one record builder. Its test holds the two records inscribed in the
  testnet rehearsal and requires byte-for-byte equality.
- `src/lib/music-awards/note.ts`: the note's hash and signature. Its test takes the signature the testnet contract
  accepted (claim `0x6445…54a2`) and recovers that contract's signer from OUR hash of the same fields, so the hash
  is the contract's. This stands in for the planned simulation test and is stronger: it is the deployed contract's
  own verdict. (The rehearsal script keeps its own copy of the builder; the test pins the two together.)
- `functions/lib/radio-awards.ts`: settings, play counting, status, plaque name, note, and the chain reads.
- `functions/radio/awards/[[path]].ts`: `config`, `status`, `note`, `record`.
- `wallPlayerOf` in `functions/lib/radio-giveaway.ts`: an address's wall number, plays and class.

How plays are counted: once per address, then kept up to date. Each look pins itself to the last finished block and
reads only transactions newer than the block already counted (one request to the chain API per 50 transactions, at
most 20 per look; a longer history carries on at the next look and says "still counting" meanwhile). The shape of
the chain API's answers was checked against the live API on 14 Nov.

Not exercised against a live award contract on mainnet (there is none yet): the first real check is the canary.

Wall numbers: a player's number is its disc's place among the wall's entries. Do not archive single entries once
awards are open, or later numbers shift (the contract would still refuse a number twice).

## Order of work

1. Shared record builder, and switch the rehearsal script to it (no behaviour change; proves the bytes).
2. `functions/lib/radio-awards.ts`: class and number, plays, name, note. Mocked chain in tests.
3. `functions/radio/awards/[[path]].ts`: the four calls, switches, limits.
4. Simulation test: server-signed note against the real contract.
5. Then the client side (separate plan): the wallet box's claim action and its review, the "Put your name on it?"
   screen, the meter, the shelf, the wall showing claimed records.

Jim's part, when 1 to 4 are done: inscribe the five templates, deploy the contract, set the five classes with their
template numbers, make the signer key and set its hash, add the secret, fund the contract, switch on, claim one
record with a real player as the canary.

## Decided (Jim, 14 Nov 2026)

1. **Every listen counts.** All confirmed paid plays by the player count: from its own address (this already
   includes the albums that come loaded in a player, which pay from the player itself) and from any album wallets
   bound to it (the server holds those signed bindings). The address on the plaque is still the player's own.
2. **The target stays adjustable until launch.** It is a server setting, `RADIO_AWARDS_TARGET_PERCENT` (10 for
   now; 100 would mean "play the player through"). Nothing in the contract fixes it: the contract only checks the
   server's signature. The figure on the plaque is the target in force when the note is signed.
3. **The class is the disc that was drawn.** Topping a player up does not change its class or its target: a Classic
   earns a Classic record when it reaches the Classic target, however many plays were added on the way.

Two things to weigh before choosing a high target:

- **Likes come out of the same balance.** A like costs 0.0002 STX, a play 0.00035. A player that likes songs runs
  out a play or two short of its full count, so at 100% it would have to add plays to finish. A target a little
  under 100 (90, say) keeps "play it through" without that trap; or the target can stay a percentage and likes
  simply mean a small top-up.
- **The claim's own network fee** (about 0.0007 STX) has to be there after the last play. Every player keeps a
  0.003 STX reserve that plays never spend, which covers it.

Changing the target after claiming has opened is possible but unfair to whoever claimed first, so the value is
settled at switch-on and written into `docs/music/AWARDS-INSCRIPTION.md` then.
