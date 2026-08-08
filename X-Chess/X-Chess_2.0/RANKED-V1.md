# ranked-v1

What makes a game count towards a rating.

---

## 1. Why a standard

Not every X Chess game should move a number that other people's ratings are
computed against. A game from a set-up position, a game on the open board where
anyone may play either colour, a game with an allow list of six wallets — all
perfectly good games, and all unrated.

Experimental games are not second-class. They are simply not the input to a
shared rating, because a rating only means anything if everybody agrees what
went into it.

**Legacy games are unrated by default and permanently.** Their participants
never agreed to ranked play, and retrofitting it onto them would be assigning
consequences to people who did not consent.

---

## 2. The conditions

Every one is either committed in the rules hash or visible in the log, so
anybody holding only the chain and this document can check all of them. Nothing
trusts a flag.

1. **The game committed to a rules hash.** Without one, a game could be claimed
   to have had any rules at all after the fact.
2. **The rules offered hash to that commitment.** No other rule set could have
   produced it, so proposing the wrong ones proves nothing.
3. **`ranked` is true inside those rules.** Not a flag beside them — inside the
   hash, which is what makes it something committed before a move was played.
4. **`replayProtocol` and `eventsProtocol` are ones this reader implements.** A
   game committed to a future protocol is not ineligible forever; it is simply
   not something this version can verify, and it says so rather than guessing.
5. **Both sides are Stacks principals**, and **different** ones.
6. **The start position is standard.**
7. **The allow list is empty.** A ranked game is decided by its two named
   players alone.
8. **Replay reached a result.** A game still in progress is not ineligible, it
   is unfinished, and it becomes eligible when it ends.
9. **Both named players are the sender of at least one accepted entry.**

### What is deliberately NOT required

`cooldown` and `noConsecutive` are permitted. With two named players who can
each only move on their own turn, neither can change a single thing — a player
physically cannot move twice in a row. They are no-ops here, and refusing them
would be a rule with no purpose.

---

## 3. Condition 9, and what "both sides accepted" means

The opponent never signs the game into existence. The creator does: they choose
the rules, pay the fee, and commit the hash.

What the opponent **does** do, if they play, is send a transaction to a game
whose rules publicly commit to being ranked. That is an on-chain act, by their
own key, that anybody can verify. That is the acceptance, and there is no
serverless way to get a stronger one — an extra "accept" transaction would be
the same act with an extra fee.

Requiring both players to have moved also closes a real hole. Without it, a
creator could name a strong player, resign immediately, and hand them a rated
win they never played.

The UI's obligation follows from this: a ranked game must be **visibly** ranked
before somebody makes their first move, because that move is their consent.

---

## 4. The registry

The core contract keeps a `ranked` boolean per game and an index of the games
that set it, so a reader can enumerate candidates without scanning every game.

**Both are discovery aids and neither is authoritative.** The truth about
whether a game is ranked is inside the rules that hash to its commitment. A game
that sets the flag but commits to unranked rules appears in the index, fails
condition 3 when a reader checks it, and contributes to nobody's rating.

This is the pattern throughout: **hints for discovery, deterministic replay for
truth.**

---

## 5. Result hints

Anyone may claim a result for a game. The contract records the claim and does
not validate it — validating a chess result would be adjudication.

A reader takes the hint as a place to look, fetches the log, replays it, and
believes the replay. A dishonest hint costs its sender a network fee and
convinces nobody.

The first claim wins the slot and cannot be overwritten, because a hint that
could be replaced could be used to hide a game from a reader that trusted it.

---

## 6. Verifying a rating from nothing

Given only the chain, the deployed contract, and this repository's protocol
documents:

1. Read `get-ranked-count` and walk `get-ranked-game`.
2. For each candidate, read the game row and its full log.
3. Recover the rules (see RULES-V1 §5) and confirm them against the commitment.
4. Replay under `replay-v1`.
5. Apply the conditions above.
6. Feed every eligible game to `elo-v1` in its canonical order.

No index, no leaderboard service, and no cache is required at any point. A
checkpoint may make step 6 faster later; it can never make it authoritative.
