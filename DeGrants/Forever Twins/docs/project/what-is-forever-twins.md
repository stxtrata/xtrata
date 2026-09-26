# What is Forever Twins?

*Draft for the public educational explainer (Milestone 1.4). Plain language on purpose.*

## The problem: most NFT art isn't on-chain

When you own most NFTs, the blockchain records two things: a token number and a link. The
artwork itself usually sits somewhere else, on IPFS or on a company's server. If the pinning
lapses, the team moves on or the server shuts down, your token still exists but the link points
at nothing. The art is gone, and there is no undo. Roughly one in five NFTs already points at a
broken link.

## The answer: a permanent twin on Bitcoin

Forever Twins creates a **twin** of an NFT: a new token whose artwork is stored in full inside
the blockchain, inscribed on Bitcoin via Stacks through Xtrata. Nothing about the twin depends on
a server staying online.

The original NFT is **never changed**. Forever Twins adds a durable counterpart next to it.

## How it works, step by step

1. **Each collection gets its own helper contract.** Before anyone can use it, the art for every
   token in the collection is recorded in the helper: a fingerprint (hash), file type, size and
   metadata link for each token. That record is then locked forever, so the helper can only ever
   create faithful twins of that collection's art.
2. **Anyone can create a twin.** Paying a small fee plus the cost of storing the art on-chain
   creates the twin. The twin is held by the helper at first.
3. **A holder swaps their original for its twin.** The helper takes the original into safe
   keeping and gives the holder the twin. Swapping is free.
4. **The twin is a normal NFT.** It can be held, sold or transferred.
5. **Whoever holds the twin can swap back.** They hand the twin to the helper and receive the
   original. This works for as long as Stacks exists; nobody can pause or block it.

## What keeps it honest

- The locked record means the art in every twin must match the published fingerprint for that
  token. The fingerprint list (the manifest) is published, and its own fingerprint is stored in
  the contract, so anyone can check it.
- Swaps check real ownership in both contracts, before and after every move.
- The helper's owner cannot pause swaps, change the record, move a paired token or redirect
  anyone's NFT.

## Costs

- A flat preservation fee per twin (1 STX at launch), shared equally between the Forever Twins
  team.
- The inscription cost for storing the art on-chain, which depends on file size and is passed
  through at cost.
- Swaps in either direction are free (you only pay the normal network fee).

## One important warning

Always use the Forever Twins page to swap. **Never send your NFT directly to a helper
contract's address.** The contract cannot tell who sent it, so it cannot simply give it back.
There is a slow, public rescue process for these mistakes while the team is able to run it, but
it cannot be guaranteed forever.
