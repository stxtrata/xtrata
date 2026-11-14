# Music Hero awards: the server side (plan)

Status: plan only, nothing here is built. It follows `AWARDS-PLAN.md` and `AWARDS-INSCRIPTION.md`; the contract
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

- Only plays from the player's own address count. Plays made from an album wallet are paid from that album's gift
  and belong to a different address, so they do not count. (Decision 1 below.)
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

The plays figure on the plaque is the class's target (5, 10, 25, 50 or 100): "the plays that earned it". (Decision 2.)

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

## Decisions wanted

1. **Album plays.** Count only the player's own plays (recommended: it is the address on the plaque, and album
   plays are paid from someone else's gift), or also plays made from its album wallets?
2. **The plays figure on the plaque.** The class target, so every Gold says 50 (recommended: stable, and a retry
   signs the same record), or the actual count at the moment of claiming?
3. **Topped-up players.** A Classic player that adds its own plays still earns a Classic record at 5 plays
   (recommended: the class is the disc they drew), or should heavy listeners be able to earn a higher class?
