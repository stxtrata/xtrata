# Paid plays: cheaper settlement (plan for the next version)

Status: not started. Parked on 2026-11-12 until the 1,000 starter players are out.
Nothing here is built. It needs a new contract and a wallet box change, so it needs
Jim's go-ahead and a security review before any code.

## The problem

A play costs the listener 350 microSTX: 50 to the song's holder and a 300 fee
(257 is the lowest fee seen confirming). About 86% of each play goes to mining.
The fee floor follows transaction size, and every transaction carries about
180 bytes of fixed overhead, so one transaction per play can never be cheap.

## The goal

More of each play to the musician, less to mining, and no way for a listener to
play without paying.

## The two changes

1. **Locked balance and signed notes.** The player locks its balance in a new
   contract. At each play it signs a small note ("I owe song N one play"). The
   server holds the notes and cashes them on-chain in bulk. The listener cannot
   dodge: the money is already locked and the note is signed at the play. The
   server can only cash what the player signed.
2. **A larger payment per play.** The 50 is fixed in the current contract. The
   new one sets a higher payment, funded by the fee saved.

Smaller, optional: slim the call (shorter contract name, fewer inputs, receipt
numbered by the contract) and drop the 300 default towards the measured floor.

## Estimates (not measured)

| Arrangement | Fee per play | To musician from 350 |
|---|---|---|
| Today | 300 | 50 |
| One slim transaction per play | about 210 | about 140 |
| Notes cashed 20 to 25 at a time | about 25 to 80 | about 270 to 325 |

## Open questions

- How a note names several holders, and whether notes are cumulative per song.
- What a listener gets back if they stop using the player (unlock rules, delay).
- How the starter-player prefunding and "Add plays" pay into the locked balance.
- Who pays the fee to cash notes, and how often.
- How play counts and artist pages read both the old and the new contract.
- Whether likes ride in the same notes.

## First steps when picked up

1. Measure the real byte size and fee of today's play transaction and of each
   option above in local simulation, then on testnet. No mainnet.
2. Write the contract and its tests. Security review.
3. Wallet box: new signing shape, reviewed on its own. Derivation labels unchanged.
4. Page and server: hold notes, cash them, show "unavailable" rather than zero
   when data is missing.
